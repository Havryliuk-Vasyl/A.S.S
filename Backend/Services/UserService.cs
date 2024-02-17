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
            try
            {
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Обробка помилок
                Console.WriteLine($"Error adding user: {ex.Message}");
                throw;
            }
        }

        public async Task<List<User>> GetUsersAsync()
        {
            try
            {
                return await _context.Users.ToListAsync();
            }
            catch (Exception ex)
            {
                // Обробка помилок
                Console.WriteLine($"Error getting users: {ex.Message}");
                throw;
            }
        }

        public async Task RemoveUserAsync(User delUser)
        {
            try
            {
                _context.Users.Remove(delUser);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Обробка помилок
                Console.WriteLine($"Error removing user: {ex.Message}");
                throw;
            }
        }

    }
}
