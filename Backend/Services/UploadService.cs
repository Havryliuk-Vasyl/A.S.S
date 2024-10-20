using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class UploadService : IUploadService
    {
        private readonly string _audioFilePath = "./media-files/audio";
        private readonly string _photoFilePath = "./media-files/photos";
        private readonly ApplicationDbContext _context;

        public UploadService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<object>> Upload(AudioUploadModel audioUploadModel)
        {
            ApiResponse<object> response = new ApiResponse<object>();

            if (!IsValidAudioUploadModel(audioUploadModel))
            {
                return response.BadRequest("Values are not valid");
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var album = await CreateAlbumAsync(audioUploadModel);
                    await SaveAlbumPhotoAsync(audioUploadModel, album.Id);
                    await LinkAlbumToGenresAsync(album.Id, audioUploadModel.GenreIds);

                    for (int i = 0; i < audioUploadModel.AudioFiles.Count; i++)
                    {
                        await ProcessAudioFileAsync(audioUploadModel, album.Id, i);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    response.Success = true;
                    response.Message = "Material uploaded successfully!";
                    return response;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return response.BadRequest(ex.Message);
                }
            }
        }

        private bool IsValidAudioUploadModel(AudioUploadModel audioUploadModel)
        {
            return audioUploadModel != null &&
                   audioUploadModel.AudioFiles != null && audioUploadModel.AudioFiles.Any() &&
                   audioUploadModel.PhotoFile != null &&
                   audioUploadModel.SongTitles != null &&
                   audioUploadModel.SongTitles.Count == audioUploadModel.AudioFiles.Count &&
                   audioUploadModel.GenreIds != null && audioUploadModel.GenreIds.Count == audioUploadModel.AudioFiles.Count;
        }

        private async Task<Album> CreateAlbumAsync(AudioUploadModel audioUploadModel)
        {
            var album = new Album
            {
                User = audioUploadModel.ArtistId,
                Title = audioUploadModel.AlbumTitle,
                DateShared = DateOnly.FromDateTime(DateTime.Today),
            };

            _context.Albums.Add(album);
            await _context.SaveChangesAsync();

            return album;
        }

        private async Task SaveAlbumPhotoAsync(AudioUploadModel audioUploadModel, int albumId)
        {
            var uniqueAlbumPhotoFileName = GenerateUniqueFileName(audioUploadModel.PhotoFile.FileName);
            var photoAlbumFilePath = Path.Combine(_photoFilePath, uniqueAlbumPhotoFileName);

            await SaveFileAsync(audioUploadModel.PhotoFile, photoAlbumFilePath);

            var photoAlbum = new AlbumPhoto
            {
                Album = albumId,
                FilePath = photoAlbumFilePath
            };

            _context.AlbumPhotos.Add(photoAlbum);
            await _context.SaveChangesAsync();
        }

        private async Task ProcessAudioFileAsync(AudioUploadModel audioUploadModel, int albumId, int index)
        {
            var audioFile = audioUploadModel.AudioFiles[index];
            var songTitle = audioUploadModel.SongTitles[index];
            var genreIds = audioUploadModel.GenreIds;

            if (audioFile == null || string.IsNullOrWhiteSpace(songTitle) || genreIds == null)
            {
                return;
            }

            var uniqueFileName = GenerateUniqueFileName(audioFile.FileName);
            var audioFilePath = Path.Combine(_audioFilePath, uniqueFileName);

            await SaveFileAsync(audioFile, audioFilePath);

            float audioDuration = GetAudioDuration(audioFilePath);

            var song = await CreateSongAsync(audioUploadModel, songTitle);
            await LinkSongToAlbumAsync(albumId, song.Id);
            await SaveAudioAsync(song.Id, audioFilePath, audioDuration);
            await SaveSongPhotoAsync(audioUploadModel, song.Id);
            await LinkAlbumToGenresAsync(albumId, genreIds);
        }

        private async Task SaveFileAsync(IFormFile file, string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        private string GenerateUniqueFileName(string originalFileName)
        {
            return $"{Guid.NewGuid()}_{originalFileName}";
        }

        private float GetAudioDuration(string filePath)
        {
            using (var audioFileReader = new NAudio.Wave.AudioFileReader(filePath))
            {
                return (float)audioFileReader.TotalTime.TotalSeconds;
            }
        }

        private async Task<Song> CreateSongAsync(AudioUploadModel audioUploadModel, string songTitle)
        {
            var songType = GetSongType(audioUploadModel.AudioFiles.Count);
            var song = new Song
            {
                Title = songTitle,
                Artist = audioUploadModel.ArtistId,
                AlbumTitle = audioUploadModel.AlbumTitle,
                DateShared = DateOnly.FromDateTime(DateTime.Today),
                Type = songType
            };

            _context.Songs.Add(song);
            await _context.SaveChangesAsync();

            return song;
        }

        private string GetSongType(int numberOfSongs)
        {
            if (numberOfSongs == 1) return "single";
            if (numberOfSongs >= 2 && numberOfSongs <= 5) return "mini-album";
            return "album";
        }

        private async Task LinkSongToAlbumAsync(int albumId, int songId)
        {
            var albumSong = new AlbumSongs
            {
                AlbumId = albumId,
                SongId = songId
            };

            _context.AlbumSongs.Add(albumSong);
            await _context.SaveChangesAsync();
        }

        private async Task SaveAudioAsync(int songId, string filePath, float duration)
        {
            var audio = new Audio
            {
                Song = songId,
                FilePath = filePath,
                Duration = duration
            };

            _context.Audios.Add(audio);
            await _context.SaveChangesAsync();
        }

        private async Task SaveSongPhotoAsync(AudioUploadModel audioUploadModel, int songId)
        {
            var uniquePhotoFileName = GenerateUniqueFileName(audioUploadModel.PhotoFile.FileName);
            var photoFilePath = Path.Combine(_photoFilePath, uniquePhotoFileName);

            await SaveFileAsync(audioUploadModel.PhotoFile, photoFilePath);

            var photo = new Photo
            {
                SongId = songId,
                FilePath = photoFilePath
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();
        }

        private async Task LinkAlbumToGenresAsync(int albumId, List<int> genreIds)
        {
            var existingGenres = await _context.Genres
                .Where(g => genreIds.Contains(g.Id))
                .Select(g => g.Id)
                .ToListAsync();

            foreach (var genreId in genreIds)
            {
                if (existingGenres.Contains(genreId))
                {
                    var albumGenre = new AlbumGenre
                    {
                        AlbumId = albumId,
                        GenreId = genreId
                    };

                    _context.AlbumGenres.Add(albumGenre);
                }
                else
                {
                    Console.WriteLine($"Genre with ID {genreId} does not exist.");
                }
            }
            await _context.SaveChangesAsync();
        }

    }
}
