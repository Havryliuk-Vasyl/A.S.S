using Backend.Models;

namespace Backend.Services
{
    public interface IPlaylistService
    {
        Task<ApiResponse<IEnumerable<Playlist>>> GetPlaylistsForUser(int userId);
        Task<ApiResponse<object>> CreatePlaylist(CreatePlaylistRequest request);
        Task<ApiResponse<object>> AddSongToPlaylist(int playlistId, int songId);
        Task<ApiResponse<object>> SetPlaylistPhoto(IFormFile photoFile, int playlistId);
        Task<ApiResponse<byte[]>> GetPhoto(int playlistId);
        Task<ApiResponse<object>> GetPlaylistWithSongs(int playlistId);
        Task<ApiResponse<object>> DeleteSongFromPlaylist(int playlistId, int songId);
        Task<ApiResponse<object>> DeletePlaylist(int playlistId);
        Task<ApiResponse<object>> EditPlaylist(int playlistId, string newPlaylistName);
    }
}
