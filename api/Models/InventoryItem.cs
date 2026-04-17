namespace ShowMeTheMenu.Api.Models;

public class InventoryItem
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string Category { get; set; }
    public required string Name { get; set; }
    public int Quantity { get; set; } = 1;
    public bool IsCrossed { get; set; }
    public DateTime CreatedAt { get; set; }
}
