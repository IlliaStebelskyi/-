using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var tasks = await _db.Tasks
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error retrieving tasks");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(TaskItem task)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                return BadRequest("Title is required");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            task.UserId = userId;
            task.CreatedAt = DateTime.Now;

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            return Ok(task);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error creating task");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskItem updatedTask)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updatedTask.Title))
                return BadRequest("Title is required");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var task = await _db.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (task == null)
                return NotFound("Task not found");

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.IsCompleted = updatedTask.IsCompleted;
            task.Priority = updatedTask.Priority;

            _db.Tasks.Update(task);
            await _db.SaveChangesAsync();

            return Ok(task);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error updating task");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var task = await _db.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (task == null) 
                return NotFound("Task not found");

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error deleting task");
        }
    }
}