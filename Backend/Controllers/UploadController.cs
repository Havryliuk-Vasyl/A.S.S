using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly string _audioFilePath = "./media-files/audio";
        private readonly string _photoFilePath = "./media-files/photos";
        private readonly ApplicationDbContext _context;

        public UploadController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadSong([FromForm] AudioUploadModel audioUploadModel)
        {
            if (audioUploadModel == null || audioUploadModel.AudioFiles == null || !audioUploadModel.AudioFiles.Any() || audioUploadModel.PhotoFile == null || audioUploadModel.SongTitles == null || audioUploadModel.SongTitles.Count != audioUploadModel.AudioFiles.Count)
            {
                return BadRequest("Invalid input. Make sure all required fields are provided.");
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var album = new Album
                    {
                        User = audioUploadModel.ArtistId,
                        Title = audioUploadModel.AlbumTitle,
                        DateShared = DateOnly.FromDateTime(DateTime.Today),
                    };
                    _context.Albums.Add(album);
                    await _context.SaveChangesAsync();

                    var albumForPhoto = await _context.Albums.Where(a => a.User == audioUploadModel.ArtistId)
                        .Where(a => a.Title == audioUploadModel.AlbumTitle)
                        .FirstAsync();

                    var uniqueAlbumPhotoFileName = Guid.NewGuid().ToString() + "_" + audioUploadModel.PhotoFile.FileName;
                    var photoAlbumFilePath = Path.Combine(_photoFilePath, uniqueAlbumPhotoFileName);
                    using (var photoStream = new FileStream(photoAlbumFilePath, FileMode.Create))
                    {
                        await audioUploadModel.PhotoFile.CopyToAsync(photoStream);
                    }

                    var photoAlbum = new AlbumPhoto
                    {
                        Album = albumForPhoto.Id,
                        FilePath = photoAlbumFilePath
                    };
                    _context.AlbumPhotos.Add(photoAlbum);

                    await _context.SaveChangesAsync(); 


                    for (int i = 0; i < audioUploadModel.AudioFiles.Count; i++)
                    {
                        var audioFile = audioUploadModel.AudioFiles[i];
                        var songTitle = audioUploadModel.SongTitles[i];

                        if (audioFile == null || string.IsNullOrWhiteSpace(songTitle))
                        {
                            continue;
                        }

                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + audioFile.FileName;
                        var filePath = Path.Combine(_audioFilePath, uniqueFileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await audioFile.CopyToAsync(stream);
                        }

                        float fileDuration;
                        using (var audioFileReader = new NAudio.Wave.AudioFileReader(filePath))
                        {
                            fileDuration = (float)audioFileReader.TotalTime.TotalSeconds;
                        }

                        var song = new Song
                        {
                            Title = songTitle,
                            Artist = audioUploadModel.ArtistId,
                            AlbumTitle = audioUploadModel.AlbumTitle,
                            DateShared = DateOnly.FromDateTime(DateTime.Today),
                            Type = audioUploadModel.AudioFiles.Count == 1 ? "single" : (audioUploadModel.AudioFiles.Count >= 2 && audioUploadModel.AudioFiles.Count <= 5 ? "mini-album" : "album")
                        };
                        _context.Songs.Add(song);
                        await _context.SaveChangesAsync();

                        var albumSong = new AlbumSongs
                        {
                            AlbumId = album.Id,
                            SongId = song.Id
                        };
                        _context.AlbumSongs.Add(albumSong);

                        var audio = new Audio
                        {
                            Song = song.Id,
                            FilePath = filePath,
                            Duration = fileDuration
                        };
                        _context.Audios.Add(audio);

                        var uniquePhotoFileName = Guid.NewGuid().ToString() + "_" + audioUploadModel.PhotoFile.FileName;
                        var photoFilePath = Path.Combine(_photoFilePath, uniquePhotoFileName);
                        using (var photoStream = new FileStream(photoFilePath, FileMode.Create))
                        {
                            await audioUploadModel.PhotoFile.CopyToAsync(photoStream);
                        }

                        var photo = new Photo
                        {
                            SongId = song.Id,
                            FilePath = photoFilePath
                        };
                        _context.Photos.Add(photo);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(ex.Message);
                }
            }
        }

    }
}
