using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
    public interface ISongService
    {
        Task<ApiResponse<object>> GetAudioById(int id);
        Task<ApiResponse<IEnumerable<object>>> GetAllSongs();
        Task<ApiResponse<IEnumerable<object>>> GetSongsByUserId(int userId);
        Task<ApiResponse<FileStream>> GetSongPhoto(int id);
        Task<ApiResponse<FileStream>> GetSongPhotoBySong(int id);

    }
}
