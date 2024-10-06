using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AdministratorService : IAdministratorService
    {
        private readonly ApplicationDbContext context;
        public AdministratorService(ApplicationDbContext context) { 
            this.context = context;
        }
        public async Task<ApiResponse<List<User>>> GetUsers()
        {
            var users = await context.Users.ToListAsync();

            return new ApiResponse<List<User>>
            {
                Success = true,
                Data = users,
                Message = "All users!"
            };
        }
        public async Task<ApiResponse<object>> DeleteUserById(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return new ApiResponse<object>().BadRequest("User not found!");
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return new ApiResponse<object> { 
                Success = true,
                Data = null,
                Message = "User deleted successful!"
            };
        }
        public async Task<ApiResponse<object>> EditUser(EditUserModel newUser)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == newUser.UserId);

            if (user == null)
            {
                return new ApiResponse<object>().BadRequest("User not found!");
            }

            user.Username = newUser.Username;
            user.Name = newUser.Name;

            context.Users.Update(user);
            await context.SaveChangesAsync();
            return new ApiResponse<object>
            {
                Success = true,
                Data = null,
                Message = "User edited successful!"
            };
        }
        public async Task<ApiResponse<object>> ConfitmBecomeArtist(BecomeArtistModel model)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == model.UserId);

            if (user == null)
            {
                return new ApiResponse<object>().BadRequest("User not found!");
            }

            user.status = "artist";
            context.Users.Update(user);

            BecomeArtistModel modelToRemove = await context.BecomeArtistModels.FirstOrDefaultAsync(bc => bc.Id == model.Id);
            context.BecomeArtistModels.Remove(modelToRemove);

            await context.SaveChangesAsync();
            return new ApiResponse<object>
            {
                Success = true,
                Data = null,
                Message = "User became an artist successful!"
            };
        }
        public async Task<ApiResponse<object>> CancleBecomeArtist(BecomeArtistModel model)
        {
            BecomeArtistModel becomeArtistModel = await context.BecomeArtistModels.FirstOrDefaultAsync(bc => bc.Id == model.Id);

            if (becomeArtistModel == null)
            {
                return new ApiResponse<object>().BadRequest("User not found!");
            }

            context.BecomeArtistModels.Remove(becomeArtistModel);

            await context.SaveChangesAsync();
            return new ApiResponse<object>
            {
                Success = true,
                Data = null,
                Message = "User did not become an artist successful!"
            };
        }
        public async Task<ApiResponse<List<RequestResponse>>> GetRequests()
        {
            var requests = await(
                from bam in context.BecomeArtistModels
                join u in context.Users on bam.UserId equals u.Id
                select new RequestResponse
                {
                    Id = bam.Id,
                    UserId = u.Id,
                    UserUsername = u.Username,
                    Description = bam.Description
                }
            ).ToListAsync();

            return new ApiResponse<List<RequestResponse>>
            {
                Success = true,
                Data = requests,
                Message = "Requests got!"
            };
        }
    }

    public class RequestResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserUsername { get; set; }
        public string Description { get; set; }
    }
    public class EditUserModel
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
    }
}
