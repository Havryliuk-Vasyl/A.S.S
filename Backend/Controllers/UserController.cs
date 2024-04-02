using Azure.Core;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private const string id = "{id}";
        private const string username = "{username}";
        private const string email = "{email}";
        private readonly ApplicationDbContext context;
        public UserController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("username/" + username)]
        public async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.username == username);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("email/" + email)]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.email == email);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("id/" + id)]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(s => s.id == id);

            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPost("register")]
        public IActionResult Post([FromBody] UserRegistrate userReg)
        {
            if (ModelState.IsValid)
            {
                var user = context.Users.FirstOrDefault(u => u.email == userReg.email);
                if (user == null)
                {
                    DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);

                    User newUser = new User(userReg.username, userReg.name, userReg.email, userReg.password, currentDate, "listener");

                    context.Users.Add(newUser);
                    context.SaveChanges();
                    return Ok("User added successfully");
                }
                return StatusCode(409, "User with this email already exists");
            }
            return BadRequest(ModelState);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin userLogin)
        {
            User user = null;
            user = await context.Users.FirstOrDefaultAsync(u => u.email == userLogin.email);
            if (user != null && user.password == userLogin.password)
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.username),
                    new Claim("email", user.email),
                    new Claim("status", user.status),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("feajfw8v8rr2nv0ruwrm2rnr2ar9a2ir9uv990mq29rvm2ar"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.UtcNow.AddDays(7);

                var token = new JwtSecurityToken(
                    issuer: "flamermusic.com",
                    audience: "flamermusicapi",
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = expires
                });
            }
            return Unauthorized();
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

                return Ok(new { Username = username, Email = email, Status = status });
            }
            catch (Exception)
            {
                return BadRequest("Invalid token");
            }
        }
    }
}
