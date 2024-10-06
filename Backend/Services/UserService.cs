using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly string _userPhotoFilePath = "./media-files/userphotos";
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            this._context = context;
        }
        public async Task<ApiResponse<User>> GetUserByUsername(string username)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return new ApiResponse<User>()
                {
                    Success = false,
                    Data = null,
                    Message = "User with this username not found!"
                };
            }

            return new ApiResponse<User>()
            {
                Success = true,
                Data = user,
                Message = "User with this username found successful!"
            };
        }
        public async Task<ApiResponse<User>> GetUserByEmail(string email)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return new ApiResponse<User>()
                {
                    Success = false,
                    Data = null,
                    Message = "User with this email not found!"
                };
            }

            return new ApiResponse<User>()
            {
                Success = true,
                Data = user,
                Message = "User with this email found successful!"
            };
        }
        public async Task<ApiResponse<User>> GetUserById(int id)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return new ApiResponse<User>()
                {
                    Success = false,
                    Data = null,
                    Message = "User with this ID not found!"
                };
            }

            return new ApiResponse<User>()
            {
                Success = true,
                Data = user,
                Message = "User with this ID found successful!"
            };
        }
        public async Task<ApiResponse<object>> UploadAvatar(IFormFile avatarFile, int userId)
        {
            ApiResponse<object> response = new ApiResponse<object>();

            try
            {
                if (userId <= 0)
                {
                    return response.BadRequest("Invalid user ID");
                }

                var existingPhoto = await _context.UsersPhoto.FirstOrDefaultAsync(p => p.User == userId);
                if (existingPhoto != null)
                {
                    if (File.Exists(existingPhoto.FilePath))
                    {
                        File.Delete(existingPhoto.FilePath);
                    }
                    _context.UsersPhoto.Remove(existingPhoto);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(avatarFile.FileName);
                var uploadsFolder = Path.Combine(_userPhotoFilePath, uniqueFileName);

                // Збереження файлу на сервері
                using (var fileStream = new FileStream(uploadsFolder, FileMode.Create))
                {
                    await avatarFile.CopyToAsync(fileStream);
                }

                var userPhoto = new UserPhoto
                {
                    User = userId,
                    FilePath = uploadsFolder
                };
                _context.UsersPhoto.Add(userPhoto);
                await _context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Avatar uploaded successfully!"
                };
            }
            catch (Exception ex)
            {
                return response.BadRequest($"Something went wrong: {ex.Message}");
            }
        }

        public async Task<ApiResponse<byte[]>> GetAvatar(int userId)
        {
            var userPhoto = await _context.UsersPhoto.FirstOrDefaultAsync(p => p.User == userId);
            if (userPhoto == null)
            {
                return new ApiResponse<byte[]>
                {
                    Success = false,
                    Data = null,
                    Message = "Photo not found."
                };
            }

            if (!System.IO.File.Exists(userPhoto.FilePath))
            {
                return new ApiResponse<byte[]>
                {
                    Success = false,
                    Data = null,
                    Message = "Photo not found."
                };
            }

            byte[] photoBytes = System.IO.File.ReadAllBytes(userPhoto.FilePath);

            return new ApiResponse<byte[]>
            {
                Success = true,
                Data = photoBytes,
                Message = "Photo retrieved successfully."
            };
        }
        public async Task<ApiResponse<object>> EditUser(int userId, string newNickname)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "User not found!"
                };
            }
            if (!string.IsNullOrEmpty(newNickname))
            {
                user.Username = newNickname;
            }
            else
            
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Something wrote wrong!"
                };
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new ApiResponse<object>
            {
                Success = true,
                Data = null,
                Message = "User updated successful!"
            };
        }
        public async Task<ApiResponse<object>> BecomeArtist(BecomeArtistModel newArtist)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Id == newArtist.UserId);
    
            if (user == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Something went wrong!"
                };
            }
    
            _context.BecomeArtistModels.Add(newArtist);
            await _context.SaveChangesAsync();
            return new ApiResponse<object>
            {
                Success = true,
                Data = null,
                Message = "Request sent successful!"
            };
        }
    }
}
