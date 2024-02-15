using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void AddUser(User newUser)
        {
            _context.Users.Add(newUser);
            _context.SaveChanges();
        }

        public List<User> GetUsers()
        {
            return _context.Users.ToList();
        }

        public void RemoveUser(User delUser)
        {
            _context.Users.Remove(delUser);
            _context.SaveChanges();
        }
    }
}
