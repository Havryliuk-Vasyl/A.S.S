using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IAdministratorService administratorService;

        public AdminController(IAdministratorService administratorService)
        {
            this.administratorService = administratorService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var response = await administratorService.GetUsers();
            if (response.Success) {
                return Ok(response);
            }
            return BadRequest();
        }

        [HttpDelete("deleteuser")]
        public async Task<IActionResult> DeleteUserById(int userId)
        {
            var response = await administratorService.DeleteUserById(userId);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest();
        }

        [HttpPut("edituser")]
        public async Task<IActionResult> EditUser([FromBody] EditUserModel editedUser)
        {
            var response = await administratorService.EditUser(editedUser);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest();
        }

        [HttpPut("confirmBecomeArtist")]
        public async Task<ActionResult> ConfitmBecomeArtist(BecomeArtistModel model)
        {
            var response = await administratorService.ConfirmBecomeArtist(model);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest();
        }

        [HttpPut("cancleBecomeArtist")]
        public async Task<ActionResult> CancleBecomeArtist(BecomeArtistModel model)
        {
            var response = await administratorService.CancleBecomeArtist(model);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest();
        }

        [HttpGet("requests")]
        [AllowAnonymous]
        public async Task<ActionResult<List<RequestResponse>>> GetRequests()
        {
            var response = await administratorService.GetRequests();
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest();
        }
    }
}
