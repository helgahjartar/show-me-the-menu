using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Dtos;

public record AiSuggestRequestDto(
    MealType? MealType,
    string? Preferences);

public record AiSuggestionDto(
    string Name,
    string Description,
    MealType SuggestedMealType);
