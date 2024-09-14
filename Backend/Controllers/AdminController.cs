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
        public async Task<IActionResult> EditUser([FromBody] EditUserModel newUser)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == newUser.UserId);

            if (user == null)
            {
                return NotFound();
            }

            user.Username = newUser.Username;
            user.Name = newUser.Name;

            context.Users.Update(user);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("confirmBecomeArtist")]
        public async Task<ActionResult> ConfitmBecomeArtist(BecomeArtistModel model)
        {
            User user = await context.Users.FirstOrDefaultAsync(u => u.Id == model.UserId);

            if (model == null)
            {
                return BadRequest();
            }

            user.status = "artist";
            context.Users.Update(user);

            BecomeArtistModel model1 = await context.BecomeArtistModels.FirstOrDefaultAsync(bc => bc.Id == model.Id);
            context.BecomeArtistModels.Remove(model1);

            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("cancleBecomeArtist")]
        public async Task<ActionResult> CancleBecomeArtist(BecomeArtistModel model)
        {
            BecomeArtistModel becomeArtistModel = await context.BecomeArtistModels.FirstOrDefaultAsync(bc => bc.Id == model.Id);

            if (becomeArtistModel == null)
            {
                return BadRequest();
            }

            context.BecomeArtistModels.Remove(becomeArtistModel);

            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("requests")]
        public async Task<ActionResult<List<RequestResponse>>> GetRequests()
        {
            var requests = await (
                from bam in context.BecomeArtistModels
                join u in context.Users on bam.UserId equals u.Id
                select new RequestResponse
                {
                    Id = bam.Id,
                    UserId = u.Id,
                    UserUsername = u.Username,
                    Description = bam.Description
                }
            ).ToListAsync();

            return Ok(requests);
        }

        public class RequestResponse
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public string UserUsername { get; set; }
            public string Description { get; set; }
        }
        public class EditUserModel
        {
            public int UserId { get; set; }
            public string Username { get; set; }
            public string Name { get; set; }
        }
    }
}
