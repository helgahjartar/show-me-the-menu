namespace ShowMeTheMenu.Api.Models;

public class WeeklyMenu
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string Name { get; set; }
    public DateOnly StartDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<MenuItem> Items { get; set; } = [];
}
