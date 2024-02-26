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
        public  IActionResult Post([FromBody] User newUser)
        {
            if(ModelState.IsValid)
            {
                return Ok("User added successfully");
            }
            return BadRequest();
        }
    }
}
