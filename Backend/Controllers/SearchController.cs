using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService searchService;

        public SearchController(ISearchService searchService)
        {
            this.searchService = searchService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll(string data)
        {
            var response = await searchService.Search(data);
            return response.Success ? Ok(response) : BadRequest();
        }
    }
}
