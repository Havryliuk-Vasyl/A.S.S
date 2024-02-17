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
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public IActionResult GetUser()
        {
            var users = _userService.GetUsers();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User newUser)
        {
            if(ModelState.IsValid)
            {
                await _userService.AddUserAsync(newUser);
                return Ok("User added successfully");
            }
            return BadRequest();
        }
    }
}
