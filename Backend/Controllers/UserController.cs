using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        public UserController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("users/{username}")]
        public async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            var user = context.Users.FirstOrDefault(u => u.username == username);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

    [HttpGet("user/{id}")]  
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        var user = context.Users.FirstOrDefault(s => s.id == id);

        if (user == null)
        {
            return NotFound();
        }
        return user;
    }

    [HttpPost("user/register")]
    public async Task<IActionResult> Post([FromBody] UserRegistrate user)
    {
        if (ModelState.IsValid)
        {
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);

            User newUser = new User(user.username, user.name, user.email, user.password, currentDate, "listener");

            context.Users.Add(newUser);
            await context.SaveChangesAsync();
            return Ok("User added successfully");
        }
        return BadRequest("Invalid user data");
    }

}
}
