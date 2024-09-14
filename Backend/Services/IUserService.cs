using Backend.Models;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<ApiResponse<User>> GetUserByUsername(string username);
        Task<ApiResponse<User>> GetUserByEmail(string email);
        Task<ApiResponse<User>> GetUserById(int id);
        Task<ApiResponse<object>> UploadAvatar(IFormFile avatar, int userId);
        Task<ApiResponse<byte[]>> GetAvatar(int userId);
        Task<ApiResponse<object>> EditUser(int userId, string newNickname);
        Task<ApiResponse<object>> BecomeArtist(BecomeArtistModel newArtist);
    }
}
