using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly ApplicationDbContext _context;
        public AuthorizationController(ApplicationDbContext context,IAuthorizationService authorizationService)
        {
            this._context = context;
            this._authorizationService = authorizationService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<object>> Registrate([FromBody] UserRegistrate userReg)
        {
            if (ModelState.IsValid) {
                return await _authorizationService.Register(userReg);
            }

            return new ApiResponse<object> {
                Success = false,
                Data = null,
                Message = "Something went wrong!"
            }; 
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] UserLogin userLogin)
        {
            if (ModelState.IsValid)
            {
                return await _authorizationService.Login(userLogin);
            }

            return new ApiResponse<object>
            {
                Success = false,
                Data = null,
                Message = "Something went wrong!"
            };
        }

        [HttpGet("validateToken")]
        public IActionResult ValidateToken()
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            var response = _authorizationService.ValidateToken(token);

            return response.Success ? Ok(response.Data) : BadRequest(response.Message);
        }
    }
}