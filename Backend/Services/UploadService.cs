using Backend.Models;

namespace Backend.Services
{
    public class UploadService : IUploadService
    {
        private readonly string _audioFilePath = "./media-files/audio";
        private readonly string _photoFilePath = "./media-files/photos";
        private readonly ApplicationDbContext context;
        public UploadService(ApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<ApiResponse<object>> Upload(AudioUploadModel audioUploadModel)
        {
            ApiResponse<object> response = new ApiResponse<object>();

            if (!IsValidAudioUploadModel(audioUploadModel))
            {
                return response.BadRequest("Values are not valid");
            }

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var album = await CreateAlbumAsync(audioUploadModel);
                    await SaveAlbumPhotoAsync(audioUploadModel, album.Id);

                    for (int i = 0; i < audioUploadModel.AudioFiles.Count; i++)
                    {
                        await ProcessAudioFileAsync(audioUploadModel, album.Id, i);
                    }

                    await context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    response.Success = true;
                    response.Message = "Material uploaded successful!";
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
                   audioUploadModel.SongTitles.Count == audioUploadModel.AudioFiles.Count;
        }

        private async Task<Album> CreateAlbumAsync(AudioUploadModel audioUploadModel)
        {
            var album = new Album
            {
                User = audioUploadModel.ArtistId,
                Title = audioUploadModel.AlbumTitle,
                DateShared = DateOnly.FromDateTime(DateTime.Today),
            };

            context.Albums.Add(album);
            await context.SaveChangesAsync();

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

            context.AlbumPhotos.Add(photoAlbum);
            await context.SaveChangesAsync();
        }

        private async Task ProcessAudioFileAsync(AudioUploadModel audioUploadModel, int albumId, int index)
        {
            var audioFile = audioUploadModel.AudioFiles[index];
            var songTitle = audioUploadModel.SongTitles[index];

            if (audioFile == null || string.IsNullOrWhiteSpace(songTitle))
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

            context.Songs.Add(song);
            await context.SaveChangesAsync();

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

            context.AlbumSongs.Add(albumSong);
            await context.SaveChangesAsync();
        }

        private async Task SaveAudioAsync(int songId, string filePath, float duration)
        {
            var audio = new Audio
            {
                Song = songId,
                FilePath = filePath,
                Duration = duration
            };

            context.Audios.Add(audio);
            await context.SaveChangesAsync();
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

            context.Photos.Add(photo);
            await context.SaveChangesAsync();
        }
    }
}
