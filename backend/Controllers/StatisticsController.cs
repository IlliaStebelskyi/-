using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/statistics")]
public class StatisticsController : ControllerBase
{
    private readonly ITaskService _taskService;

    public StatisticsController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetStatistics()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);
            var stats = await _taskService.GetStatisticsAsync(userId);

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Error retrieving statistics" });
        }
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);
            var categories = await _taskService.GetCategoriesAsync(userId);

            return Ok(categories);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Error retrieving categories" });
        }
    }
}
