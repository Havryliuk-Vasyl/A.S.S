using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SearchService : ISearchService
    {
        private readonly ApplicationDbContext context;
        public SearchService(ApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<ApiResponse<object>> Search(string data)
        {   
            ApiResponse<object> response = new ApiResponse<object>();

            if (string.IsNullOrEmpty(data))
            {
                return response.BadRequest("String is null");
            }

            var userResults = await context.Users
                .Where(u => u.Username.Contains(data))
                .Select(u => new SearchResult { Type = "User", Title = u.Username, Id = u.Id })
                .ToListAsync();

            var songResults = await context.Songs
                .Where(s => s.Title.Contains(data))
                .Select(s => new SearchResult { Type = "Song", Title = s.Title, Id = s.Id })
                .ToListAsync();

            var albumResults = await context.Albums
                .Where(a => a.Title.Contains(data))
                .Select(a => new SearchResult { Type = "Album", Title = a.Title, Id = a.Id })
                .ToListAsync();

            var results = userResults
                .Concat(songResults)
                .Concat(albumResults)
                .ToList();

            response.Success = true;
            response.Data = results;
            response.Message = "OK";

            return response;
        }
    }
}
