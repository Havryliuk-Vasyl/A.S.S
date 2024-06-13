using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public AdminController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpDelete("user")]
        public async Task<IActionResult> DeleteUserById(int userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return BadRequest();
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("edituser")]
        public async Task<IActionResult> EditUser(int userId, [FromBody] User newUser)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            user.Username = newUser.Username;
            user.Name = newUser.Name;
            user.Email = newUser.Email;

            context.Users.Update(user);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
