using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class AiSuggestionService : IAiSuggestionService
{
    private static readonly List<AiSuggestionDto> Suggestions =
    [
        new("Spaghetti Carbonara", "Classic Italian pasta with eggs, cheese, pancetta, and pepper.", MealType.Dinner),
        new("Greek Salad", "Fresh tomatoes, cucumbers, olives, and feta cheese.", MealType.Lunch),
        new("Overnight Oats", "Oats soaked in milk with berries and honey.", MealType.Breakfast),
        new("Chicken Stir-Fry", "Quick stir-fried chicken with vegetables and soy sauce.", MealType.Dinner),
        new("Avocado Toast", "Toasted bread with mashed avocado, lime, and chili flakes.", MealType.Breakfast),
        new("Minestrone Soup", "Hearty Italian vegetable soup with pasta and beans.", MealType.Lunch),
        new("Banana Smoothie", "Blended banana with yogurt, honey, and cinnamon.", MealType.Snack),
        new("Grilled Salmon", "Pan-seared salmon with lemon and dill.", MealType.Dinner),
        new("Hummus & Veggies", "Creamy hummus with carrot and celery sticks.", MealType.Snack),
        new("Pancakes", "Fluffy buttermilk pancakes with maple syrup.", MealType.Breakfast),
    ];

    public Task<List<AiSuggestionDto>> SuggestAsync(AiSuggestRequestDto request)
    {
        var results = Suggestions.AsEnumerable();

        if (request.MealType.HasValue)
            results = results.Where(s => s.SuggestedMealType == request.MealType.Value);

        return Task.FromResult(results.Take(5).ToList());
    }
}
