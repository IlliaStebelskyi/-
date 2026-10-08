using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class TaskItem
{
    public int Id { get; set; }
    public int UserId { get; set; }

    [Required]
    public string Title { get; set; } = "";
    
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
    
    public DateTime? DueDate { get; set; }
    
    [Required]
    public string Priority { get; set; } = "Medium";
    
    [Required]
    public string Category { get; set; } = "General";
}