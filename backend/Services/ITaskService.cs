using backend.Models;

namespace backend.Services;

public interface ITaskService
{
    Task<List<TaskItem>> GetUserTasksAsync(int userId);
    Task<List<TaskItem>> GetUserTasksFilteredAsync(int userId, string? category = null, string? priority = null, bool? isCompleted = null);
    Task<TaskItem?> GetTaskByIdAsync(int taskId, int userId);
    Task<TaskItem> CreateTaskAsync(TaskItem task, int userId);
    Task<TaskItem?> UpdateTaskAsync(int taskId, TaskItem updatedTask, int userId);
    Task<bool> DeleteTaskAsync(int taskId, int userId);
    Task<TaskStatistics> GetStatisticsAsync(int userId);
    Task<List<string>> GetCategoriesAsync(int userId);
}

public class TaskStatistics
{
    public int Total { get; set; }
    public int Completed { get; set; }
    public int Pending { get; set; }
    public int HighPriority { get; set; }
    public int OverdueTasks { get; set; }
    public double CompletionRate { get; set; }
}
