using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public SearchController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll(string data)
        {
            if (string.IsNullOrEmpty(data))
            {
                return BadRequest("Search term cannot be empty");
            }

            var userResults = await context.Users
                .Where(u => u.Username.Contains(data))
                .Select(u => new SearchResult { Type = "User", Name = u.Name, Id = u.Id })
                .ToListAsync();

            var songResults = await context.Songs
                .Where(s => s.Title.Contains(data))
                .Select(s => new SearchResult { Type = "Song", Name = s.Title, Id = s.Id })
                .ToListAsync();

            var albumResults = await context.Albums
                .Where(a => a.Title.Contains(data))
                .Select(a => new SearchResult { Type = "Album", Name = a.Title, Id = a.Id })
                .ToListAsync();

            var results = userResults
                .Concat(songResults)
                .Concat(albumResults)
                .ToList();

            return Ok(results);
        }
    }
}
