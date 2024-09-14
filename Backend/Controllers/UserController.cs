using Azure;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Cms;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private const string id = "{id}";
        private const string username = "{username}";
        private const string email = "{email}";
        public UserController(IUserService userService)
        {
            this._userService = userService;
        }

        [HttpGet("username/" + username)]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var response = await _userService.GetUserByUsername(username);
            if (response.Success)
            {
                return Ok(response);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpGet("email/" + email)]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var response= await _userService.GetUserByEmail(email);
            if (response.Success)
            {
                return Ok(response);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpGet("id/" + id)]
        public async Task<IActionResult> GetUserById(int id)
        {
            var response = await _userService.GetUserById(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPost("uploadAvatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile avatar, [FromForm] int userId)
        {
            var response = await _userService.UploadAvatar(avatar, userId);
            if (response.Success) 
            {
                return Ok(response);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpGet("avatar/{userId}")]
        public async Task<IActionResult> GetAvatar(int userId)
        {
            var response = await _userService.GetAvatar(userId);
            if (response.Success)
            {
                return File(response.Data, "image/*");
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPut("edituser")]
        public async Task<IActionResult> EditUser(int userId, [FromBody] string newNickname)
        {
            var response = await _userService.EditUser(userId, newNickname);
            if (response.Success)
            {
                return Ok(response);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPost("becomeArtist")]
        public async Task<IActionResult> BecomeArtist(BecomeArtistModel newArtist)
        {
            var response = await _userService.BecomeArtist(newArtist);
            if (response.Success)
            {
                return Ok(response); 
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }
    }
}