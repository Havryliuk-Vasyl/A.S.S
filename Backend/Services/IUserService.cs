using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IUserService
    {
        void AddUser(User newUser);
        List<User> GetUsers();
        User GetUserByID(int id);
        void RemoveUser(User delUser);
    }
}
