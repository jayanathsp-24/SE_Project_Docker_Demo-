using System;
using Microsoft.AspNetCore.Mvc;
using OnboardFlow.Api.Models;

namespace OnboardFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        // Allow demo accounts or any valid standard credentials for testing
        string fullName;
        string role;
        string company = "Apex Global Advisory Partners";

        if (request.Email.Contains("admin", StringComparison.OrdinalIgnoreCase))
        {
            fullName = "Sarah Jenkins";
            role = "Compliance Lead";
        }
        else if (request.Email.Contains("partner", StringComparison.OrdinalIgnoreCase))
        {
            fullName = "Marcus Vance";
            role = "Managing Partner";
        }
        else
        {
            var prefix = request.Email.Split('@')[0];
            fullName = char.ToUpper(prefix[0]) + prefix.Substring(1).Replace(".", " ");
            role = "Onboarding Specialist";
        }

        // Return mock JWT and user profile
        var mockToken = $"mock-jwt-token-{Guid.NewGuid():N}";

        return Ok(new LoginResponse
        {
            Token = mockToken,
            Message = "Authentication successful",
            User = new UserDto
            {
                Id = "usr-8821",
                Email = request.Email,
                FullName = fullName,
                Role = role,
                Company = company
            }
        });
    }

    [HttpGet("me")]
    public ActionResult<UserDto> GetCurrentUser()
    {
        return Ok(new UserDto
        {
            Id = "usr-8821",
            Email = "sarah.jenkins@onboardflow.com",
            FullName = "Sarah Jenkins",
            Role = "Compliance Lead",
            Company = "Apex Global Advisory Partners"
        });
    }
}
