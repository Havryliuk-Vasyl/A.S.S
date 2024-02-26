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

        public UserService()
        {
            userRepository = new UserRepository();
        }

        public void AddUser(User newUser)
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

        public List<User> GetUsers()
        {
            try
            {
                return userRepository.getAll();
            }
            catch (Exception ex)
            {
                // Обробка помилок
                Console.WriteLine($"Error getting users: {ex.Message}");
                throw;
            }
        }

        public void RemoveUser(User delUser)
        {
            try
            {
                userRepository.deleteById(delUser.id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing user: {ex.Message}");
                throw;
            }
        }
    }
}
