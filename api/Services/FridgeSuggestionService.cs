using System.Text.Json;
using Anthropic.SDK;
using Anthropic.SDK.Messaging;
using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public class FridgeSuggestionService : IFridgeSuggestionService
{
    private readonly IRecipeService _recipeService;
    private readonly ISettingsService _settingsService;
    private readonly ILogger<FridgeSuggestionService> _logger;

    public FridgeSuggestionService(
        IRecipeService recipeService,
        ISettingsService settingsService,
        ILogger<FridgeSuggestionService> logger)
    {
        _recipeService = recipeService;
        _settingsService = settingsService;
        _logger = logger;
    }

    public async Task<FridgeSuggestionResponseDto> SuggestAsync(FridgeSuggestionRequestDto request, string userId)
    {
        var apiKey = await _settingsService.GetApiKeyAsync(userId);
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("No Anthropic API key configured. Please add your API key in Settings.");

        var recipes = await _recipeService.GetAllAsync(userId);

        var excludedIds = new HashSet<int>(request.ExcludedRecipeIds);
        var availableRecipes = recipes.Where(r => !excludedIds.Contains(r.Id)).ToList();

        var recipeList = availableRecipes.Count > 0
            ? string.Join("\n", availableRecipes.Select(r =>
                $"- ID {r.Id}: {r.Name}\n  Ingredients: {r.Ingredients}"))
            : "(none)";

        var prompt = $$"""
            You are a cooking assistant. The user has the following ingredients available in their fridge:

            {{request.Ingredients}}

            Here are the user's saved recipes (only consider these):
            {{recipeList}}

            Your task:
            1. If one of the saved recipes is a good match for the available ingredients (the user has most of the required ingredients), return that recipe.
            2. If no saved recipe is a reasonable match, suggest a new recipe the user could make with their available ingredients.

            Respond with ONLY a JSON object in this exact format, no other text:
            {
              "matchedRecipeId": 5,
              "recipeName": "Pasta Carbonara",
              "description": "A classic Italian pasta dish",
              "ingredients": "200g pasta\n2 eggs\n100g pancetta\n50g parmesan\nBlack pepper",
              "instructions": "1. Cook pasta...\n2. ...",
              "isExistingRecipe": true,
              "explanation": "You have most ingredients for this recipe."
            }

            Rules:
            - If matching a saved recipe, set matchedRecipeId to that recipe's ID and isExistingRecipe to true. Use the recipe's exact name, ingredients, and instructions from the list above.
            - If suggesting a new recipe, set matchedRecipeId to null and isExistingRecipe to false. Provide full ingredients and step-by-step instructions.
            - description is optional (can be null).
            - explanation should be a short, friendly sentence explaining the suggestion.
            - Return ONLY the JSON object, no markdown, no explanation outside the JSON.
            """;

        var client = new AnthropicClient(apiKey);

        var message = new MessageParameters
        {
            Model = "claude-sonnet-4-5-20250929",
            MaxTokens = 1024,
            Messages = [new Message(RoleType.User, prompt)]
        };

        var response = await client.Messages.GetClaudeMessageAsync(message);
        var text = response.Content.OfType<TextContent>().FirstOrDefault()?.Text;

        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("AI returned an empty response.");

        var jsonText = text.Trim();
        if (jsonText.StartsWith("```"))
        {
            var start = jsonText.IndexOf('{');
            var end = jsonText.LastIndexOf('}');
            if (start >= 0 && end > start)
                jsonText = jsonText[start..(end + 1)];
        }

        var parsed = JsonSerializer.Deserialize<AiFridgeResponse>(jsonText, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (parsed is null)
            throw new InvalidOperationException("Failed to parse AI response.");

        return new FridgeSuggestionResponseDto(
            MatchedRecipeId: parsed.MatchedRecipeId,
            RecipeName: parsed.RecipeName,
            Description: parsed.Description,
            Ingredients: parsed.Ingredients,
            Instructions: parsed.Instructions,
            IsExistingRecipe: parsed.IsExistingRecipe,
            Explanation: parsed.Explanation);
    }

    private record AiFridgeResponse(
        int? MatchedRecipeId,
        string RecipeName,
        string? Description,
        string Ingredients,
        string? Instructions,
        bool IsExistingRecipe,
        string Explanation);
}
