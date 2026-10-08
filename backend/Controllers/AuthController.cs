using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Username and password are required" });

            if (dto.Username.Length < 3)
                return BadRequest(new { message = "Username must be at least 3 characters" });

            if (dto.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters" });

            var existing = _db.Users.FirstOrDefault(x => x.Username == dto.Username);
            if (existing != null)
                return BadRequest(new { message = "Username already exists" });

            var hasher = new PasswordHasher<User>();
            var user = new User { Username = dto.Username };
            user.PasswordHash = hasher.HashPassword(user, dto.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return Unauthorized(new { message = "Invalid credentials" });

            var user = _db.Users.FirstOrDefault(x => x.Username == dto.Username);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var hasher = new PasswordHasher<User>();
            var ok = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (ok == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid credentials" });

            var token = GenerateToken(user);
            return Ok(new { token });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    private string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"] ?? "SUPER_SECRET_KEY_123"));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}