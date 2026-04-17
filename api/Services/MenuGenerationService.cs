using System.Text.Json;
using Anthropic.SDK;
using Anthropic.SDK.Messaging;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class MenuGenerationService
{
    private readonly RecipeService _recipeService;
    private readonly WeeklyMenuService _menuService;
    private readonly SettingsService _settingsService;
    private readonly ILogger<MenuGenerationService> _logger;

    public MenuGenerationService(
        RecipeService recipeService,
        WeeklyMenuService menuService,
        SettingsService settingsService,
        ILogger<MenuGenerationService> logger)
    {
        _recipeService = recipeService;
        _menuService = menuService;
        _settingsService = settingsService;
        _logger = logger;
    }

    public async Task<WeeklyMenuDto> GenerateAsync(GenerateMenuDto request, string userId)
    {
        var recipes = await _recipeService.GetAllAsync(userId);

        if (request.Tags is { Count: > 0 })
            recipes = recipes
                .Where(r => r.Tags.Any(t => request.Tags.Contains(t, StringComparer.OrdinalIgnoreCase)))
                .ToList();

        if (request.MaxCookingMinutes.HasValue)
            recipes = recipes
                .Where(r => r.CookingTimeMinutes == null || r.CookingTimeMinutes <= request.MaxCookingMinutes)
                .ToList();

        if (recipes.Count == 0)
            throw new InvalidOperationException("No recipes match the selected filters.");

        var daysOfWeek = request.DaysOfWeek is { Count: > 0 }
            ? request.DaysOfWeek.Distinct().OrderBy(d => d).ToList()
            : Enumerable.Range(0, 7).ToList();
        var dayCount = daysOfWeek.Count;

        var startDate = request.StartDate ?? GetNextMonday();
        var name = request.Name ?? $"Week of {startDate:MMM d}";

        var menu = await _menuService.CreateAsync(new CreateWeeklyMenuDto(name, startDate), userId);

        var selectedIds = await PickRecipeIdsWithAi(recipes, dayCount, request.Ingredients, userId);

        // Fallback to random if AI fails or returns invalid IDs
        if (selectedIds == null || selectedIds.Count != dayCount)
        {
            _logger.LogWarning("AI selection failed or returned wrong count, falling back to random");
            selectedIds = PickRandomRecipeIds(recipes, dayCount);
        }

        var validIds = new HashSet<int>(recipes.Select(r => r.Id));
        if (selectedIds.Any(id => !validIds.Contains(id)))
        {
            _logger.LogWarning("AI returned invalid recipe IDs, falling back to random");
            selectedIds = PickRandomRecipeIds(recipes, dayCount);
        }

        var items = daysOfWeek.Select((dayOfWeek, i) => new SetMenuItemDto(
            DayOfWeek: dayOfWeek,
            MealType: MealType.Dinner,
            RecipeId: selectedIds[i],
            CustomName: null,
            Notes: null
        )).ToList();

        var result = await _menuService.SetItemsAsync(menu.Id, new SetMenuItemsDto(items), userId);
        return result!;
    }

    private async Task<List<int>?> PickRecipeIdsWithAi(List<RecipeDto> recipes, int dayCount, string? ingredients, string userId)
    {
        try
        {
            var apiKey = await _settingsService.GetApiKeyAsync(userId);
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogInformation("No API key configured, skipping AI selection");
                return null;
            }

            var client = new AnthropicClient(apiKey);

            var recipeList = string.Join("\n", recipes.Select(r =>
            {
                var tags = r.Tags.Count > 0 ? $", tags: {string.Join(", ", r.Tags)}" : "";
                var time = r.CookingTimeMinutes.HasValue ? $", cooking time: {r.CookingTimeMinutes}min" : "";
                return $"- ID {r.Id}: {r.Name} (ingredients: {r.Ingredients}{tags}{time})";
            }));

            var ingredientsHint = !string.IsNullOrWhiteSpace(ingredients)
                ? $"\n\nThe user currently has these ingredients at home: {ingredients}\nPrioritize recipes that use these ingredients."
                : "";

            var prompt = $$"""
                You are a meal planning assistant. Given the following recipes, pick exactly {{dayCount}} that maximize ingredient overlap — meaning they share common ingredients so the total shopping list is minimized and food waste is reduced.

                Recipes:
                {{recipeList}}{{ingredientsHint}}

                Respond with ONLY a JSON object in this exact format, no other text:
                {"recipeIds": [1, 2, 3]}

                Rules:
                - Pick exactly {{dayCount}} recipe IDs from the list above
                - Prioritize recipes that share ingredients (e.g., multiple recipes using chicken, onions, garlic)
                - If there are fewer than {{dayCount}} recipes, you may repeat IDs to fill {{dayCount}} slots
                - Return ONLY the JSON object, no explanation
                """;

            var message = new MessageParameters
            {
                Model = "claude-sonnet-4-6",
                MaxTokens = 256,
                Messages = [new Message(RoleType.User, prompt)]
            };

            var response = await client.Messages.GetClaudeMessageAsync(message);
            var text = response.Content.OfType<TextContent>().FirstOrDefault()?.Text;

            if (string.IsNullOrWhiteSpace(text))
                return null;

            // Extract JSON if wrapped in markdown code block
            var jsonText = text.Trim();
            if (jsonText.StartsWith("```"))
            {
                var start = jsonText.IndexOf('{');
                var end = jsonText.LastIndexOf('}');
                if (start >= 0 && end > start)
                    jsonText = jsonText[start..(end + 1)];
            }

            var parsed = JsonSerializer.Deserialize<AiMenuResponse>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return parsed?.RecipeIds;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get AI recipe selection");
            return null;
        }
    }

    private static List<int> PickRandomRecipeIds(List<RecipeDto> recipes, int count)
    {
        var rng = Random.Shared;
        return Enumerable.Range(0, count)
            .Select(_ => recipes[rng.Next(recipes.Count)].Id)
            .ToList();
    }

    private static DateOnly GetNextMonday()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var daysUntilMonday = ((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7;
        if (daysUntilMonday == 0)
            daysUntilMonday = 7;
        return today.AddDays(daysUntilMonday);
    }

    private record AiMenuResponse(List<int> RecipeIds);
}
