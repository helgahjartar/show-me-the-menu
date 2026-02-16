namespace ShowMeTheMenu.Api.Models;

public class MenuItem
{
    public int Id { get; set; }
    public int WeeklyMenuId { get; set; }
    public int? RecipeId { get; set; }
    public int DayOfWeek { get; set; } // 0 = Monday, 6 = Sunday
    public MealType MealType { get; set; }
    public string? CustomName { get; set; }
    public string? Notes { get; set; }

    public WeeklyMenu WeeklyMenu { get; set; } = null!;
    public Recipe? Recipe { get; set; }
}
