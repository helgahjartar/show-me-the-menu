namespace ShowMeTheMenu.Api.Dtos;

public record RecipeDto(
    int Id,
    string Name,
    string? Description,
    string Ingredients,
    string Instructions,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record CreateRecipeDto(
    string Name,
    string? Description,
    string Ingredients,
    string Instructions);

public record UpdateRecipeDto(
    string Name,
    string? Description,
    string Ingredients,
    string Instructions);
