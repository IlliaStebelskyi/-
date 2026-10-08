using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _db;

    public TaskService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TaskItem>> GetUserTasksAsync(int userId)
    {
        return await _db.Tasks
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<TaskItem>> GetUserTasksFilteredAsync(int userId, string? category = null, string? priority = null, bool? isCompleted = null)
    {
        var query = _db.Tasks.Where(x => x.UserId == userId);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(x => x.Category == category);

        if (!string.IsNullOrEmpty(priority))
            query = query.Where(x => x.Priority == priority);

        if (isCompleted.HasValue)
            query = query.Where(x => x.IsCompleted == isCompleted.Value);

        return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int taskId, int userId)
    {
        return await _db.Tasks.FirstOrDefaultAsync(x => x.Id == taskId && x.UserId == userId);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskItem task, int userId)
    {
        if (string.IsNullOrWhiteSpace(task.Title))
            throw new ArgumentException("Title is required");

        task.UserId = userId;
        task.CreatedAt = DateTime.UtcNow;
        task.IsCompleted = false;

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(int taskId, TaskItem updatedTask, int userId)
    {
        var task = await GetTaskByIdAsync(taskId, userId);
        if (task == null)
            return null;

        if (string.IsNullOrWhiteSpace(updatedTask.Title))
            throw new ArgumentException("Title is required");

        task.Title = updatedTask.Title;
        task.Description = updatedTask.Description;
        task.IsCompleted = updatedTask.IsCompleted;
        task.Priority = updatedTask.Priority;
        task.Category = updatedTask.Category;
        task.DueDate = updatedTask.DueDate;

        _db.Tasks.Update(task);
        await _db.SaveChangesAsync();

        return task;
    }

    public async Task<bool> DeleteTaskAsync(int taskId, int userId)
    {
        var task = await GetTaskByIdAsync(taskId, userId);
        if (task == null)
            return false;

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<TaskStatistics> GetStatisticsAsync(int userId)
    {
        var tasks = await GetUserTasksAsync(userId);
        var completed = tasks.Count(x => x.IsCompleted);
        var total = tasks.Count;
        var overdue = tasks.Count(x => !x.IsCompleted && x.DueDate < DateTime.UtcNow);
        var highPriority = tasks.Count(x => !x.IsCompleted && x.Priority == "High");

        return new TaskStatistics
        {
            Total = total,
            Completed = completed,
            Pending = total - completed,
            OverdueTasks = overdue,
            HighPriority = highPriority,
            CompletionRate = total > 0 ? Math.Round((double)completed / total * 100, 1) : 0
        };
    }

    public async Task<List<string>> GetCategoriesAsync(int userId)
    {
        return await _db.Tasks
            .Where(x => x.UserId == userId)
            .Select(x => x.Category)
            .Distinct()
            .OrderBy(x => x)
            .ToListAsync();
    }
}
