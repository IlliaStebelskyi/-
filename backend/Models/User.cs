using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Username { get; set; } = "";
    
    [Required]
    public string PasswordHash { get; set; } = "";
}