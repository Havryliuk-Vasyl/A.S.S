using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using NAudio.Wave;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AudioUploadController : ControllerBase
    {
        private readonly string _audioFilePath = "./media-files/audio";
        private readonly string _photoFilePath = "./media-files/photos";
        private readonly ApplicationDbContext context;

        public AudioUploadController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpPost("uploadsong")]
        public async Task<IActionResult> UploadSong([FromForm] AudioUploadModel audioUploadModel)
        {
            if (audioUploadModel == null || audioUploadModel.AudioFile == null)
            {
                return BadRequest("No audio file provided");
            }

            try
            {
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + audioUploadModel.AudioFile.FileName;
                var filePath = Path.Combine(_audioFilePath, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await audioUploadModel.AudioFile.CopyToAsync(stream);
                }

                float fileDuration;
                using (var audioFile = new AudioFileReader(filePath))
                {
                    fileDuration = (float)audioFile.TotalTime.TotalSeconds;
                }

               
                var photoFilePath = Path.Combine(_photoFilePath, audioUploadModel.PhotoFile.FileName);
                using (var photoStream = new FileStream(photoFilePath, FileMode.Create))
                {
                    await audioUploadModel.PhotoFile.CopyToAsync(photoStream);
                }

                var song = new Song
                {
                    Title = audioUploadModel.Title,
                    Artist = audioUploadModel.ArtistId,
                    AlbumTitle = audioUploadModel.AlbumTitle,
                    DateShared = DateOnly.FromDateTime(DateTime.Today)
                };

                await context.Songs.AddAsync(song);
                await context.SaveChangesAsync();

                var audio = new Audio
                {
                    Song = song.Id,
                    FilePath = filePath,
                    Duration = fileDuration
                };
                await context.Audios.AddAsync(audio);

                var photo = new Photo
                {
                    SongId = song.Id,
                    FilePath = photoFilePath
                };
                await context.Photos.AddAsync(photo);

                await context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}