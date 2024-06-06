using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity;

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

        [HttpDelete("user")]
        public async Task<IActionResult> DeleteUserById(int userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return BadRequest();
            }

            context.Remove(userId);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("edituser")]
        public async Task<ActionResult> EditUser(int userId, User newUser)
        {
            User user = context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            user.Username = newUser.Username; 
            user.Name = newUser.Name;
            user.Email = newUser.Email;

            context.Update(user);
            await context.SaveChangesAsync();
            return Ok();
        }

    }
}
