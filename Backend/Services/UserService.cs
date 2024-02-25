using Backend.Models;
using Backend.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;

        public UserService(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task AddUserAsync(User newUser)
        {
            try
            {

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
                await userRepository.getAll();
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
                await userRepository.deleteById(delUser.id);
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
