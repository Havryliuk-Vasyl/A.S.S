using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private const string id = "{id}";
        private const string username = "{username}";
        private const string email = "{email}";
        private readonly ApplicationDbContext context;
        public UserController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("username/" + username)]
        public async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.username == username);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("email/" + username)]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.email == email);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("id/" + id)]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(s => s.id == id);

            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Post([FromBody] UserRegistrate user)
        {
            if (ModelState.IsValid)
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);

                User newUser = new User(user.username, user.name, user.email, user.password, currentDate, "listener");

                await context.Users.AddAsync(newUser);
                await context.SaveChangesAsync();
                return Ok("User added successfully");
            }
            return BadRequest("Invalid user data");
        }
    }
}
