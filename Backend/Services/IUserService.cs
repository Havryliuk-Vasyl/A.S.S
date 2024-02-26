using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IUserService
    {
        void AddUser(User newUser);
        List<User> GetUsers();
        void RemoveUser(User delUser);
    }
}
