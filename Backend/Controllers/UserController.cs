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

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _userService.GetUsers();
            return Ok(users);
        }

        [HttpGet("user/id")]
        public IActionResult GetUserById(int id) {
            var user = _userService.GetUserByID(id);
            return Ok(user);
        }

        [HttpPost]
        public  IActionResult Post([FromBody] User newUser)
        {
            if(ModelState.IsValid)
            {
                _userService.AddUser(newUser);
                return Ok("User added successfully");
            }
            return BadRequest();
        }
    }
}
