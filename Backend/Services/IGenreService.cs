using Backend.Models;

namespace Backend.Services
{
    public interface IGenreService
    {
        Task<ApiResponse<List<Genre>>> GetGenresAsync();
    }
}
