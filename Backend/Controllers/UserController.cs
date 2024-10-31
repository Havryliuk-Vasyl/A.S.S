using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;
        private const string id = "{id}";
        private const string username = "{username}";
        private const string email = "{email}";
        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet("username/" + username)]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var response = await userService.GetUserByUsername(username);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }

        [HttpGet("email/" + email)]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var response= await userService.GetUserByEmail(email);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }

        [HttpGet("id/" + id)]
        public async Task<IActionResult> GetUserById(int id)
        {
            var response = await userService.GetUserById(id);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }

        [HttpPost("uploadAvatar")]
        //[Produces("multipart/form-data")]
        public async Task<IActionResult> UploadAvatar([FromBody] IFormFile avatarFile, int userId)
        {
            if (avatarFile == null || avatarFile.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            var response = await userService.UploadAvatar(avatarFile, userId);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }

        [HttpGet("avatar/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvatar(int userId)
        {
            var response = await userService.GetAvatar(userId);
            return response.Success ? File(response.Data, "image/*") : BadRequest(response.Message);
        }

        [HttpPut("edituser")]
        public async Task<IActionResult> EditUser(int userId, [FromBody] string newNickname)
        {
            var response = await userService.EditUser(userId, newNickname);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }

        [HttpPost("becomeArtist")]
        public async Task<IActionResult> BecomeArtist(BecomeArtistModel newArtist)
        {
            var response = await userService.BecomeArtist(newArtist);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }
    }
}