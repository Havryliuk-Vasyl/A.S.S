using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime;
using System.Security.Claims;
using System.Text;


namespace Backend.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly ApplicationDbContext _context;
        public AuthorizationService(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<ApiResponse<object>> Login(UserLogin userLogin)
        {
            if (userLogin == null || string.IsNullOrEmpty(userLogin.email) || string.IsNullOrEmpty(userLogin.password))
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid login request. Email or password is missing."
                };
            }

            User user = await IsEmailAndPasswordCorrectAsync(userLogin.email, userLogin.password);

            if (user == null)
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "User is not authorized!"
                };
            }

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

            return new ApiResponse<object>
            {
                Success = true,
                Data = new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = expires
                },
                Message = "Authorization is successful!"
            };
        }


        public async Task<ApiResponse<object>> Register(UserRegistrate userRegistrate)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userRegistrate.email);
            if (user == null)
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);

                User newUser = new User(userRegistrate.username, userRegistrate.name, userRegistrate.email, userRegistrate.password, currentDate, "listener");

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return new ApiResponse<object>
                {
                    Success = true,
                    Data = null,
                    Message = "Registration is successful!"
                };
            }
            else
            {
                return new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "User with email already exists!"
                };
            }
        }


        public async Task<User> IsEmailAndPasswordCorrectAsync(string email, string password)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || user.Password != password)
            {
                return null;
            }

            return user;
        }

        public ApiResponse<object> ValidateToken(string token)
        {
            var response = new ApiResponse<object>();

            if (token == null || string.IsNullOrWhiteSpace(token))
            {
                return response.BadRequest("Token is not valid!");
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
                    return response.BadRequest("User not found");
                }

                response.Success = true;
                response.Data = new { Username = username, Email = email, Status = status, Id = id };
                response.Message = "Token is valid!";

                return response;
            }
            catch (Exception)
            {
                return response.BadRequest("Token is not valid!");
            }
        }
    }
}
