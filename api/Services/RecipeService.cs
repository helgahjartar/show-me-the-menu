using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class RecipeService(AppDbContext db) : IRecipeService
{
    public async Task<List<RecipeDto>> GetAllAsync(string userId)
    {
        return await db.Recipes
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.UpdatedAt)
            .Select(r => ToDto(r))
            .ToListAsync();
    }

    public async Task<RecipeDto?> GetByIdAsync(int id, string userId)
    {
        var recipe = await db.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        return recipe is null ? null : ToDto(recipe);
    }

    public async Task<RecipeDto> CreateAsync(CreateRecipeDto dto, string userId)
    {
        var now = DateTime.UtcNow;
        var recipe = new Recipe
        {
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            Ingredients = dto.Ingredients,
            Instructions = dto.Instructions,
            Tags = dto.Tags ?? [],
            CookingTimeMinutes = dto.CookingTimeMinutes,
            CreatedAt = now,
            UpdatedAt = now
        };

        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();

        return ToDto(recipe);
    }

    public async Task<RecipeDto?> UpdateAsync(int id, UpdateRecipeDto dto, string userId)
    {
        var recipe = await db.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (recipe is null) return null;

        recipe.Name = dto.Name;
        recipe.Description = dto.Description;
        recipe.Ingredients = dto.Ingredients;
        recipe.Instructions = dto.Instructions;
        recipe.Tags = dto.Tags ?? recipe.Tags;
        recipe.CookingTimeMinutes = dto.CookingTimeMinutes;
        recipe.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return ToDto(recipe);
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var recipe = await db.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (recipe is null) return false;

        db.Recipes.Remove(recipe);
        await db.SaveChangesAsync();

        return true;
    }

    public async Task<List<string>> GetAllTagsAsync(string userId)
    {
        return await db.Recipes
            .Where(r => r.UserId == userId)
            .SelectMany(r => r.Tags)
            .Distinct()
            .OrderBy(t => t)
            .ToListAsync();
    }

    private static RecipeDto ToDto(Recipe r) => new(
        r.Id, r.Name, r.Description, r.Ingredients, r.Instructions,
        r.Tags, r.CookingTimeMinutes, r.CreatedAt, r.UpdatedAt);
}
