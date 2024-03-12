using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        public UserController( ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return Ok();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<User>> GetUserById(int id) {
            var user = context.Users.FirstOrDefault(s => s.id == id);

            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPost]
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
