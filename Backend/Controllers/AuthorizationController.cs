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
        public async Task<ApiResponse<object>> Registrate([FromBody] UserRegistrate userReg)
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
        public async Task<ApiResponse<object>> Login([FromBody] UserLogin userLogin)
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

            if (token == null || string.IsNullOrWhiteSpace(token))
            {
                return BadRequest("Token is missing");
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("feajfw8v8rr2nv0ruwrm2rnr2ar9a2ir9uv990mq29rvm2ar");
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "flamermusic.com",
                    ValidAudience = "flamermusicapi",
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var username = jwtToken.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
                var email = jwtToken.Claims.FirstOrDefault(x => x.Type == "email")?.Value;
                var status = jwtToken.Claims.FirstOrDefault(x => x.Type == "status")?.Value;
                var id = jwtToken.Claims.FirstOrDefault(x => x.Type == "id")?.Value;

                var user = _context.Users.FirstOrDefault(u => u.Id == int.Parse(id));
                if (user == null)
                {
                    return NotFound("User not found");
                }

                if (user.Username != username || user.Email != email || user.status != status)
                {
                    return BadRequest("User information mismatch");
                }

                return Ok(new { Username = username, Email = email, Status = status, Id = id });
            }
            catch (Exception)
            {
                return BadRequest("Invalid token");
            }
        }
    }
}