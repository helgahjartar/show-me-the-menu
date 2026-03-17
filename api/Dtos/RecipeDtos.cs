namespace ShowMeTheMenu.Api.Dtos;

public record RecipeDto(
    int Id,
    string Name,
    string? Description,
    string Ingredients,
    string Instructions,
    List<string> Tags,
    int? CookingTimeMinutes,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record CreateRecipeDto(
    string Name,
    string? Description,
    string Ingredients,
    string Instructions,
    List<string>? Tags,
    int? CookingTimeMinutes);

public record UpdateRecipeDto(
    string Name,
    string? Description,
    string Ingredients,
    string Instructions,
    List<string>? Tags,
    int? CookingTimeMinutes);
