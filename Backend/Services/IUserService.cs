using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IUserService
    {
        Task AddUserAsync(User newUser);
        Task<List<User>> GetUsersAsync();
        Task RemoveUserAsync(User delUser);
    }
}
