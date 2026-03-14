using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Dtos;

public record MenuItemDto(
    int Id,
    int DayOfWeek,
    MealType MealType,
    int? RecipeId,
    string? RecipeName,
    string? CustomName,
    string? Notes);

public record WeeklyMenuDto(
    int Id,
    string Name,
    DateOnly StartDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<MenuItemDto> Items);

public record WeeklyMenuSummaryDto(
    int Id,
    string Name,
    DateOnly StartDate,
    int ItemCount,
    DateTime CreatedAt);

public record CreateWeeklyMenuDto(
    string Name,
    DateOnly StartDate);

public record UpdateWeeklyMenuDto(
    string Name,
    DateOnly StartDate);

public record SetMenuItemDto(
    int DayOfWeek,
    MealType MealType,
    int? RecipeId,
    string? CustomName,
    string? Notes);

public record SetMenuItemsDto(
    List<SetMenuItemDto> Items);

public record GenerateMenuDto(
    string? Name,
    DateOnly? StartDate);

public record ShoppingListItemDto(
    int DayOfWeek,
    string MealName,
    string Ingredients);
