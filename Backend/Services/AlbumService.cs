using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AlbumService : IAlbumService
    {
        /// <summary>
        /// Realization of IAlbumService
        /// </summary>
        private readonly ApplicationDbContext _context;

        public AlbumService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<Album>>> GetAlbumsByArtist(int artistId)
        {
            try
            {
                var albums = await _context.Albums
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
                var photo = await _context.AlbumPhotos.FirstOrDefaultAsync(a => a.Album == albumId);
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
                Album album = await _context.Albums.FindAsync(albumId);
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
                var albumSong = await _context.AlbumSongs
                    .FirstOrDefaultAsync(als => als.AlbumId == albumId && als.SongId == songId);

                if (albumSong == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Song not found in album."
                    };
                }

                _context.AlbumSongs.Remove(albumSong);
                await _context.SaveChangesAsync();

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
                var album = await _context.Albums.FindAsync(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Album not found."
                    };
                }

                album.Title = newAlbumName;
                await _context.SaveChangesAsync();

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
                var album = await GetAlbumBySong(songId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Album not found for the given song."
                    };
                }

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = album,
                    Message = "Album retrieved successfully."
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
            var album = await _context.Albums
                .Include(a => a.AlbumSongs)
                    .ThenInclude(als => als.Song)
                        .ThenInclude(s => s.Audios)
                .FirstOrDefaultAsync(a => a.Id == albumId);

            if (album == null)
                return null;

            var artist = await _context.Users.FirstOrDefaultAsync(a => a.Id == album.User);
            if (artist == null)
                return null;

            var albumSongs = album.AlbumSongs.Select(als => new
            {
                SongId = als.Song.Id,
                SongTitle = als.Song.Title,
                Audios = als.Song.Audios.Select(audio => new
                {
                    AudioId = audio.Id,
                    audio.Duration,
                    audio.FilePath
                })
            });

            return new
            {
                AlbumId = album.Id,
                AlbumTitle = album.Title,
                DateShared = album.DateShared,
                ArtistId = artist.Id,
                ArtistUsername = artist.Username,
                Songs = albumSongs
            };
        }

        private async Task<object> GetAlbumBySong(int songId)
        {
            var album = await _context.Albums
                .Include(a => a.AlbumSongs)
                    .ThenInclude(als => als.Song)
                        .ThenInclude(s => s.Audios)
                .FirstOrDefaultAsync(a => a.AlbumSongs.Any(als => als.SongId == songId));

            if (album == null)
                return null;

            var artist = await _context.Users.FirstOrDefaultAsync(a => a.Id == album.User);
            if (artist == null)
                return null;

            var albumSongs = album.AlbumSongs.Select(als => new
            {
                SongId = als.Song.Id,
                SongTitle = als.Song.Title,
                Audios = als.Song.Audios.Select(audio => new
                {
                    AudioId = audio.Id,
                    audio.Duration,
                    audio.FilePath
                })
            });

            return new
            {
                AlbumId = album.Id,
                AlbumTitle = album.Title,
                DateShared = album.DateShared,
                ArtistId = artist.Id,
                ArtistUsername = artist.Username,
                Songs = albumSongs
            };
        }
        private async Task<ApiResponse<object>> DeleteAlbumAndFiles(int albumId)
        {
            try
            {
                var album = await _context.Albums.FindAsync(albumId);
                if (album == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Album not found."
                    };
                }

                var albumSongs = await _context.AlbumSongs
                    .Where(als => als.AlbumId == albumId)
                    .Select(als => als.SongId)
                    .ToListAsync();

                var albumPhotos = await _context.AlbumPhotos
                    .Where(ap => ap.Album == albumId)
                    .Select(ap => ap.FilePath)
                    .ToListAsync();

                var audioFiles = await _context.Audios
                    .Where(a => albumSongs.Contains(a.Song))
                    .ToListAsync();

                var songPhotos = await _context.Photos
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
                _context.AlbumSongs.RemoveRange(_context.AlbumSongs.Where(als => als.AlbumId == albumId));
                _context.AlbumPhotos.RemoveRange(_context.AlbumPhotos.Where(ap => ap.Album == albumId));
                _context.Audios.RemoveRange(audioFiles);
                _context.Albums.Remove(album);

                await _context.SaveChangesAsync();

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
