using Backend.Models;

namespace Backend.Services
{
    public interface IAdministratorService
    {
        Task<ApiResponse<List<User>>> GetUsers();
        Task<ApiResponse<object>> DeleteUserById(int id);
        Task<ApiResponse<object>> EditUser(EditUserModel newUser);
        Task<ApiResponse<object>> ConfirmBecomeArtist(BecomeArtistModel model);
        Task<ApiResponse<object>> CancleBecomeArtist(BecomeArtistModel model);
        Task<ApiResponse<List<RequestResponse>>> GetRequests();

    }
}
