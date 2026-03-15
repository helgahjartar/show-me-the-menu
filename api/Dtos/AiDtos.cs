using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Dtos;

public record AiSuggestRequestDto(
    MealType? MealType,
    string? Preferences);

public record AiSuggestionDto(
    string Name,
    string Description,
    MealType SuggestedMealType);

public record FridgeSuggestionRequestDto(
    string Ingredients,
    List<int> ExcludedRecipeIds);

public record FridgeSuggestionResponseDto(
    int? MatchedRecipeId,
    string RecipeName,
    string? Description,
    string Ingredients,
    string? Instructions,
    bool IsExistingRecipe,
    string Explanation);
