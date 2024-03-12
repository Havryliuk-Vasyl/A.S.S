using Backend.Models;
using Backend.Services;
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
            //var user = context._user.Select(s => new User(
            //    s.id,
            //    s.username,
            //    s.name,
            //    s.password,
            //    s.email,
            //    s.date_joined,
            //    s.status
            //))
            //    .Where(s => s.id == id)
            //    .FirstOrDefault(s => s.id == id);
            
            var user = context.Users
    .FirstOrDefault(s => s.id == id);


            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User newUser)
        {
            if (ModelState.IsValid)
            {
                context.Users.Add(newUser);
                await context.SaveChangesAsync();
                return Ok("User added successfully");
            }
            return BadRequest("Invalid user data");
        }

    }
}
