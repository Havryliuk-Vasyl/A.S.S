using Backend.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IAlbumService
    {
        Task<ApiResponse<IEnumerable<Album>>> GetAlbumsByArtist(int artistId);
        Task<ApiResponse<object>> GetAlbumByAlbumId(int albumId);
        Task<ApiResponse<byte[]>> GetPhoto(int albumId);
        Task<ApiResponse<object>> DeleteAlbum(int albumId);
        Task<ApiResponse<object>> SetAlbumPhoto(IFormFile photoFile, int albumId);
        Task<ApiResponse<object>> DeleteSongFromAlbum(int albumId, int songId);
        Task<ApiResponse<object>> EditAlbum(int albumId, string newAlbumName);
        Task<ApiResponse<object>> GetAlbumBySongId(int songId);
    }
}
