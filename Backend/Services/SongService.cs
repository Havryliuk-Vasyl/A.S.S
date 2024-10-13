using Azure;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SongService : ISongService
    {
        private readonly ApplicationDbContext context;
        public SongService(ApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<ApiResponse<object>> GetAudioById(int id)
        {
            var song = await context.Songs.FirstOrDefaultAsync(s => s.Id == id);

            if (song == null)
            {
                return new ApiResponse<object>().BadRequest("Song not found!");
            }

            var artist = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
            if (artist == null)
            {
                return new ApiResponse<object>().BadRequest("Artist not found!");
            }

            object? responseData = null;

            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
            var audio = await context.Audios.FirstOrDefaultAsync(a => a.Song == song.Id);
            var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == song.Id);
            if (user != null && audio != null && photo != null)
            {
                responseData = new
                {
                    song.Id,
                    song.Title,
                    ArtistId = song.Artist,
                    ArtistName = artist.Username,
                    duration = audio.Duration,
                    photo
                };
            }

            if (responseData == null)
            {
                return new ApiResponse<object>().BadRequest("Something went wrong!");
            }

            return new ApiResponse<object>
            {
                Success = true,
                Data = responseData,
                Message = "OK!"
            };
        }
        public async Task<ApiResponse<IEnumerable<object>>> GetAllSongs()
        {
            var songs = await context.Songs.ToListAsync();
            if (songs == null || songs.Count == 0)
            {
                return new ApiResponse<IEnumerable<object>> {
                    Success = false,
                    Data = null,
                    Message = "Something went wrong!" 
                }; 
            }

            var response = new List<object>();
            foreach (var song in songs)
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
                var audio = await context.Audios.FirstOrDefaultAsync(a => a.Song == song.Id);
                var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == song.Id);
                if (user != null && audio != null && photo != null)
                {
                    response.Add(new
                    {
                        song,
                        artist = user.Username,
                        artistId = user.Id,
                        duration = audio.Duration,
                        photo
                    });
                }
            }

            return new ApiResponse<IEnumerable<object>>
            {
                Success = true,
                Data = response,
                Message = "Songs got successful!"
            };
        }
        public async Task<ApiResponse<IEnumerable<object>>> GetSongsByUserId(int userId)
        {
            var songs = await context.Songs.Where(s => s.Artist == userId).ToListAsync();

            if (songs == null || songs.Count == 0)
            {
                return new ApiResponse<IEnumerable<object>>
                {
                    Success = false,
                    Data = null,
                    Message = "Something went wrong!"
                };
            }

            var response = new List<object>();
            foreach (var song in songs)
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
                var audio = await context.Audios.FirstOrDefaultAsync(a => a.Song == song.Id);
                var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == song.Id);
                if (user != null && audio != null && photo != null)
                {
                    response.Add(new
                    {
                        song.Id,
                        song.Title,
                        ArtistId = song.Artist,
                        ArtistName = user.Username,
                        duration = audio.Duration,
                        photo
                    });
                }
            }

            return new ApiResponse<IEnumerable<object>> { 
                Success = true, 
                Data = response,
                Message = "Songs got successful!"
            };
        }
        public async Task<ApiResponse<FileStream>> GetSongPhoto(int id)
        {
            ApiResponse<FileStream> response = new ApiResponse<FileStream>();

            var photo = await context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            if (photo == null && !System.IO.File.Exists(photo.FilePath))
            {
                return response;
            }

            response.Success = true;
            response.Data = new FileStream(photo.FilePath, FileMode.Open, FileAccess.Read);
            response.Message = "Photo got successful!";

            return response;
        }

        public async Task<ApiResponse<FileStream>> GetSongPhotoBySong(int id)
        {
            ApiResponse<FileStream> response = new ApiResponse<FileStream>();

            var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == id);
            if (photo == null && !System.IO.File.Exists(photo.FilePath))
            {
                return response;
            }

            response.Success = true;
            response.Data = new FileStream(photo.FilePath, FileMode.Open, FileAccess.Read);
            response.Message = "Photo got successful!";

            return response;
        }

    }
}
