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

        public async Task AddUserAsync(User newUser)
        {
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();
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
