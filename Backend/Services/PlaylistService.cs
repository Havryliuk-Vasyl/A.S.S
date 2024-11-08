using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;
using System.Threading.Tasks;
using Org.BouncyCastle.Utilities;

namespace Backend.Services
{
    public class PlaylistService : IPlaylistService
    {
        private readonly ApplicationDbContext context;
        private readonly string _playlistPhotoFilePath = "./media-files/playlistphotos";
        private readonly ILogger<PlaylistService> _logger;

        public PlaylistService(ApplicationDbContext context, ILogger<PlaylistService> logger)
        {
            this.context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<IEnumerable<Playlist>>> GetPlaylistsForUser(int userId)
        {
            try
            {
                var playlists = await context.Playlists
                    .Where(p => p.User == userId)
                    .ToListAsync();

                _logger.LogInformation($"User {userId} retrieved playlists.");
                return new ApiResponse<IEnumerable<Playlist>>
                {
                    Success = true,
                    Data = playlists,
                    Message = "Playlists retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving playlists.");
                return new ApiResponse<IEnumerable<Playlist>>
                {
                    Success = false,
                    Data = null,
                    Message = "Error retrieving playlists."
                };
            }
        }

        public async Task<ApiResponse<object>> CreatePlaylist(CreatePlaylistRequest request)
        {
            if (request == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Request data is null."
                };
            }

            try
            {
                var playlist = new Playlist
                {
                    Title = request.Title,
                    User = request.UserId
                };

                context.Playlists.Add(playlist);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Playlist created successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating playlist.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error creating playlist."
                };
            }
        }

        public async Task<ApiResponse<object>> AddSongToPlaylist(int playlistId, int songId)
        {
            try
            {
                var playlist = await GetPlaylist(playlistId);
                if (playlist == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Playlist not found."
                    };
                }

                var song = await context.Songs.FindAsync(songId);
                if (song == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Song not found."
                    };
                }

                var playlistSong = new PlaylistSong
                {
                    PlaylistId = playlistId,
                    SongId = songId
                };

                context.PlaylistSongs.Add(playlistSong);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Song added to playlist successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding song to playlist.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error adding song to playlist."
                };
            }
        }

        public async Task<ApiResponse<object>> SetPlaylistPhoto(byte[] photoBytes, int playlistId, string fileExtension)
        {
            if (photoBytes == null || photoBytes.Length == 0)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "No file uploaded."
                };
            }

            try
            {
                var existingPhoto = await context.PlaylistPhotos.FirstOrDefaultAsync(p => p.Playlist == playlistId);
                if (existingPhoto != null)
                {
                    if (File.Exists(existingPhoto.FilePath))
                    {
                        File.Delete(existingPhoto.FilePath);
                    }
                    context.PlaylistPhotos.Remove(existingPhoto);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
                var uploadsFolder = Path.Combine(_playlistPhotoFilePath, uniqueFileName);

                await File.WriteAllBytesAsync(uploadsFolder, photoBytes);

                var playlistPhoto = new PlaylistPhoto
                {
                    Playlist = playlistId,
                    FilePath = uploadsFolder
                };
                context.PlaylistPhotos.Add(playlistPhoto);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Photo uploaded successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading photo.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error uploading photo."
                };
            }
        }

        public async Task<ApiResponse<byte[]>> GetPhoto(int playlistId)
        {
            try
            {
                var playlistPhoto = await context.PlaylistPhotos.FirstOrDefaultAsync(p => p.Playlist == playlistId);
                if (playlistPhoto == null || !File.Exists(playlistPhoto.FilePath))
                {
                    return new ApiResponse<byte[]>
                    {
                        Success = false,
                        Data = null,
                        Message = "Photo not found."
                    };
                }

                byte[] photoBytes = File.ReadAllBytes(playlistPhoto.FilePath);
                return new ApiResponse<byte[]>
                {
                    Success = true,
                    Data = photoBytes,
                    Message = "Photo retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving photo.");
                return new ApiResponse<byte[]>
                {
                    Success = false,
                    Data = null,
                    Message = "Error retrieving photo."
                };
            }
        }

        public async Task<ApiResponse<object>> GetPlaylistWithSongs(int playlistId)
        {
            try
            {
                var playlist = await context.Playlists
                    .Where(p => p.Id == playlistId)
                    .Include(p => p.PlaylistSongs)
                    .ThenInclude(ps => ps.Song)
                    .FirstOrDefaultAsync();

                if (playlist == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Playlist not found."
                    };
                }

                var playlistOwner = await context.Users.FirstOrDefaultAsync(u => u.Id == playlist.User);
                if (playlistOwner == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Playlist not found."
                    };
                }

                var songResponse = new List<object>();

                foreach (var s in playlist.PlaylistSongs)
                {
                    var song = await context.Songs.FirstOrDefaultAsync(so => so.Id == s.SongId);
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
                                artist = user.Username,
                                artistId = user.Id,
                                duration = audio.Duration,
                                photo
                            });
                        }
                    }
                }

                var response = new
                {
                    User = playlistOwner.Id,
                    PlaylistId = playlist.Id,
                    PlaylistTitle = playlist.Title,
                    Songs = songResponse
                };

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = response,
                    Message = "Playlist with songs retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving playlist with songs.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error retrieving playlist with songs."
                };
            }
        }

        public async Task<ApiResponse<object>> DeleteSongFromPlaylist(int playlistId, int songId)
        {
            try
            {
                var playlist = await GetPlaylist(playlistId);
                if (playlist == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Playlist not found."
                    };
                }

                var playlistSong = await context.PlaylistSongs
                    .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

                if (playlistSong == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Song not found in playlist."
                    };
                }

                context.PlaylistSongs.Remove(playlistSong);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Song removed from playlist successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing song from playlist.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error removing song from playlist."
                };
            }
        }

        public async Task<ApiResponse<object>> DeletePlaylist(int playlistId)
        {
            try
            {
                var playlist = await GetPlaylist(playlistId);
                if (playlist == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Playlist not found."
                    };
                }

                var playlistPhoto = await context.PlaylistPhotos.FirstOrDefaultAsync(p => p.Playlist == playlistId);
                if (playlistPhoto != null)
                {
                    if (File.Exists(playlistPhoto.FilePath))
                    {
                        File.Delete(playlistPhoto.FilePath);
                    }

                    context.PlaylistPhotos.Remove(playlistPhoto);
                }

                context.Playlists.Remove(playlist);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Playlist and its photo deleted successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting playlist.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error deleting playlist."
                };
            }
        }


        public async Task<ApiResponse<object>> EditPlaylist(int playlistId, string newPlaylistName)
        {
            if (string.IsNullOrEmpty(newPlaylistName))
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "New playlist name is invalid."
                };
            }

            try
            {
                var playlist = await GetPlaylist(playlistId);
                if (playlist == null)
                {
                    return new ApiResponse<object>
                    {
                        Success = false,
                        Data = null,
                        Message = "Playlist not found."
                    };
                }

                playlist.Title = newPlaylistName;
                context.Playlists.Update(playlist);
                await context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Playlist updated successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating playlist.");
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Error updating playlist."
                };
            }
        }

        private async Task<Playlist> GetPlaylist(int playlistId) =>
            await context.Playlists.FindAsync(playlistId);
    }
}
