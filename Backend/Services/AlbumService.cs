using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AlbumService : IAlbumService
    {
        private readonly ApplicationDbContext context;

        public AlbumService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<ApiResponse<IEnumerable<Album>>> GetAlbumsByArtist(int artistId)
        {
            try
            {
                var albums = await context.Albums
                    .Where(a => a.User == artistId)
                    .ToListAsync();

                return new ApiResponse<IEnumerable<Album>>
                {
                    Success = true,
                    Data = albums,
                    Message = "Albums retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IEnumerable<Album>>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving albums: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<object>> GetAlbumByAlbumId(int albumId)
        {
            try
            {
                var album = await GetAlbumDetails(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Album not found."
                    };
                }

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = album,
                    Message = "Album details retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving album details: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<byte[]>> GetPhoto(int albumId)
        {
            try
            {
                var photo = await context.AlbumPhotos.FirstOrDefaultAsync(a => a.Album == albumId);
                if (photo == null || !File.Exists(photo.FilePath))
                {
                    return new ApiResponse<byte[]>
                    {
                        Success = false,
                        Data = null,
                        Message = "Photo not found."
                    };
                }

                byte[] photoBytes = await File.ReadAllBytesAsync(photo.FilePath);
                return new ApiResponse<byte[]>
                {
                    Success = true,
                    Data = photoBytes,
                    Message = "Photo retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<byte[]>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving photo: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<object>> DeleteAlbum(int albumId)
        {
            try
            {
                Album album = await context.Albums.FindAsync(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Album not found."
                    };
                }

                await DeleteAlbumAndFiles(album.Id);
                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Album deleted successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error deleting album: {ex.Message}"
                };
            }
        }
        public async Task<ApiResponse<object>> DeleteSongFromAlbum(int albumId, int songId)
        {
            try
            {
                var albumSong = await context.AlbumSongs
                    .FirstOrDefaultAsync(als => als.AlbumId == albumId && als.SongId == songId);

                if (albumSong == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Song not found in album."
                    };
                }

                context.AlbumSongs.Remove(albumSong);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Song removed from album successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error removing song from album: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<object>> EditAlbum(int albumId, string newAlbumName)
        {
            try
            {
                var album = await context.Albums.FindAsync(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Album not found."
                    };
                }

                album.Title = newAlbumName;
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Album updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error updating album: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<object>> GetAlbumBySongId(int songId)
        {
            try
            {
                int albumId = await GetAlbumBySong(songId);
                if (albumId == 0)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Album not found for the given song."
                    };
                }

                var album = await GetAlbumDetails(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Album not found."
                    };
                }

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = album,
                    Message = "Album details retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = $"Error retrieving album by song ID: {ex.Message}"
                };
            }
        }

        private async Task<object> GetAlbumDetails(int albumId)
        {
            var album = await context.Albums
                .Where(a => a.Id ==  albumId)
                .Include(a => a.AlbumSongs)
                .ThenInclude(als => als.Song)
                .FirstOrDefaultAsync();

            if (album == null)
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Album not found."
                };

            var artist = await context.Users.FirstOrDefaultAsync(a => a.Id == album.User);
            if (artist == null)
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Artist not found."
                };

            var songResponse = new List<object>();

            foreach (var s in album.AlbumSongs)
            {
                var song = await context.Songs.FirstOrDefaultAsync(so => so.Id == s.Id);
                if (song != null)
                {
                    var user = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
                    var audio = await context.Audios.FirstOrDefaultAsync(a => a.Song == song.Id);
                    var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == song.Id);
                    if (user != null && audio != null && photo != null)
                    {
                        songResponse.Add(new
                        {
                            id = song.Id,
                            title = song.Title,
                            albumTitle = song.AlbumTitle,
                            duration = audio.Duration,
                            photo
                        });
                    }
                }
            }

            var response = new
            {
                Id = album.Id,
                Title = album.Title,
                ArtistId = artist.Id,
                DateShared = album.DateShared,
                Songs = songResponse
            };

            return new ApiResponse<object>
            {
                Success = true,
                Data = response,
                Message = "Album with songs retrieved successfully."
            };
        }

        private async Task<int> GetAlbumBySong(int songId)
        {
            var album = await context.Albums
                .Include(a => a.AlbumSongs)
                    .ThenInclude(als => als.Song)
                        .ThenInclude(s => s.Audios)
                .FirstOrDefaultAsync(a => a.AlbumSongs.Any(als => als.SongId == songId));

            if (album == null)
                return 0;

            return album.Id;
        }

        private async Task<ApiResponse<object>> DeleteAlbumAndFiles(int albumId)
        {
            try
            {
                var album = await context.Albums.FindAsync(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Album not found."
                    };
                }

                var albumSongs = await context.AlbumSongs
                    .Where(als => als.AlbumId == albumId)
                    .Select(als => als.SongId)
                    .ToListAsync();

                var albumPhotos = await context.AlbumPhotos
                    .Where(ap => ap.Album == albumId)
                    .Select(ap => ap.FilePath)
                    .ToListAsync();

                var audioFiles = await context.Audios
                    .Where(a => albumSongs.Contains(a.Song))
                    .ToListAsync();

                var songPhotos = await context.Photos
                    .Where(p => albumSongs.Contains(p.SongId))
                    .ToListAsync();

                // Delete files
                foreach (var audioFile in audioFiles)
                {
                    if (File.Exists(audioFile.FilePath))
                    {
                        File.Delete(audioFile.FilePath);
                    }
                }

                foreach (var albumPhotoPath in albumPhotos)
                {
                    if (File.Exists(albumPhotoPath))
                    {
                        File.Delete(albumPhotoPath);
                    }
                }

                foreach (var songPhotoPath in songPhotos)
                {
                    if (File.Exists(songPhotoPath.FilePath))
                    {
                        File.Delete(songPhotoPath.FilePath);
                    }
                }

                // Remove database entries
                context.AlbumSongs.RemoveRange(context.AlbumSongs.Where(als => als.AlbumId == albumId));
                context.AlbumPhotos.RemoveRange(context.AlbumPhotos.Where(ap => ap.Album == albumId));
                context.Audios.RemoveRange(audioFiles);
                context.Albums.Remove(album);

                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Album and related files deleted successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error deleting album and files: {ex.Message}"
                };
            }
        }
    }
}
