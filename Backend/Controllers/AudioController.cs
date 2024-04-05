using Azure.Core;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AudioController : ControllerBase
    {
        private const string id = "id";
        private const string name = "name";
        private const string atrist = "atrist";
        private readonly ApplicationDbContext context;

        public AudioController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("id/" + id)]
        public async Task<ActionResult<Song>> GetSongById(int id)
        {
            return Ok(); 
        }
    }
}