namespace ShowMeTheMenu.Api.Models;

public class Recipe
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Ingredients { get; set; }
    public required string Instructions { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<MenuItem> MenuItems { get; set; } = [];
}
