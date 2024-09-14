using Backend.Models;

namespace Backend.Services
{
    public interface IAuthorizationService
    {
        Task<ApiResponse<object>> Register(UserRegistrate userRegistrate);
        Task<ApiResponse<object>> Login(UserLogin userLogin);
    }
}
