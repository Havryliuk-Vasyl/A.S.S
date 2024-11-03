using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class GenreService : IGenreService
    {
        private readonly ApplicationDbContext context;

        public GenreService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<ApiResponse<List<Genre>>> GetGenresAsync()
        {
            var genres = await context.Genres.ToListAsync();

            if (genres == null)
            {
                return new ApiResponse<List<Genre>>
                {
                    Success = false,
                    Data = null,
                    Message = "There are no genres!"
                };
            }

            return new ApiResponse<List<Genre>>
            {
                Success = true,
                Data = genres,
                Message = "All genres"
            };
        }
    }
}
