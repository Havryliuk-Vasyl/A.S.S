using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IUserService
    {
        List<User> GetUsers();
        Task AddUserAsync(User newUser);
        void RemoveUser(User delUser);
    }
}
