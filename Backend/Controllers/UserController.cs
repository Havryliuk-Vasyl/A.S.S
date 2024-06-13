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
        private readonly string _userPhotoFilePath = "./media-files/userphotos";
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
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("email/" + email)]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("id/" + id)]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(s => s.Id == id);

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
                var user = context.Users.FirstOrDefault(u => u.Email == userReg.email);
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
            user = await context.Users.FirstOrDefaultAsync(u => u.Email == userLogin.email);
            if (user != null && user.Password == userLogin.password)
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                    new Claim("email", user.Email),
                    new Claim("status", user.status),
                    new Claim("id", user.Id.ToString()),
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
                var id = jwtToken.Claims.FirstOrDefault(x => x.Type == "id")?.Value;

                // Отримання інформації про користувача з бази даних за ідентифікатором
                var user = context.Users.FirstOrDefault(u => u.Id == int.Parse(id));
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Перевірка, чи інформація про користувача співпадає з тим, що міститься в токені
                if (user.Username != username || user.Email != email || user.status != status)
                {
                    return BadRequest("User information mismatch");
                }

                // Повернення інформації про користувача
                return Ok(new { Username = username, Email = email, Status = status, Id = id });
            }
            catch (Exception)
            {
                return BadRequest("Invalid token");
            }
        }


        [HttpPost("uploadAvatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile avatar, [FromForm] int userId)
        {
            try
            {
                if (avatar == null || avatar.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                if (!avatar.ContentType.StartsWith("image/"))
                {
                    return BadRequest("Only image files are allowed");
                }

                if (userId <= 0)
                {
                    return BadRequest("Invalid user ID");
                }

                var existingPhoto = await context.UsersPhoto.FirstOrDefaultAsync(p => p.User == userId);
                if (existingPhoto != null)
                {
                    if (System.IO.File.Exists(existingPhoto.FilePath))
                    {
                        System.IO.File.Delete(existingPhoto.FilePath);
                    }
                    context.UsersPhoto.Remove(existingPhoto);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(avatar.FileName);

                var uploadsFolder = Path.Combine(_userPhotoFilePath, uniqueFileName);

                using (var stream = new FileStream(uploadsFolder, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                var userPhoto = new UserPhoto
                {
                    User = userId,
                    FilePath = uploadsFolder
                };
                context.UsersPhoto.Add(userPhoto);
                await context.SaveChangesAsync();

                return Ok("Avatar uploaded successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading avatar: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("avatar/{userId}")]
        public async Task<IActionResult> GetAvatar(int userId)
        {
            var userPhoto = await context.UsersPhoto.FirstOrDefaultAsync(p => p.User == userId);
            if (userPhoto == null)
            {
                return NotFound();
            }

            if (!System.IO.File.Exists(userPhoto.FilePath))
            {
                return NotFound();
            }

            byte[] photoBytes = System.IO.File.ReadAllBytes(userPhoto.FilePath);

            return File(photoBytes, "image/jpeg");
        }

        [HttpPut("edituser")]
        public async Task<ActionResult> EditUser(int userId, [FromBody] string newNickname)
        {
            try
            {
                User user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                if (!string.IsNullOrEmpty(newNickname))
                {
                    user.Username = newNickname;
                }
                else
                {
                    return BadRequest("New nickname is empty!");
                }

                context.Users.Update(user);
                await context.SaveChangesAsync();
                return Ok("Nickname updated successfully");
            }
            catch (DbUpdateException dbEx)
            {
                // Логувати виключення для налагодження
                Console.WriteLine($"Error updating user: {dbEx.InnerException?.Message}");
                return StatusCode(500, "An error occurred while updating the nickname. Please check the data and try again.");
            }
            catch (Exception ex)
            {
                // Обробити інші можливі виключення
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}