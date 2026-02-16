using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class RecipeService(AppDbContext db) : IRecipeService
{
    public async Task<List<RecipeDto>> GetAllAsync()
    {
        return await db.Recipes
            .OrderByDescending(r => r.UpdatedAt)
            .Select(r => ToDto(r))
            .ToListAsync();
    }

    public async Task<RecipeDto?> GetByIdAsync(int id)
    {
        var recipe = await db.Recipes.FindAsync(id);
        return recipe is null ? null : ToDto(recipe);
    }

    public async Task<RecipeDto> CreateAsync(CreateRecipeDto dto)
    {
        var now = DateTime.UtcNow;
        var recipe = new Recipe
        {
            Name = dto.Name,
            Description = dto.Description,
            Ingredients = dto.Ingredients,
            Instructions = dto.Instructions,
            CreatedAt = now,
            UpdatedAt = now
        };

        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();

        return ToDto(recipe);
    }

    public async Task<RecipeDto?> UpdateAsync(int id, UpdateRecipeDto dto)
    {
        var recipe = await db.Recipes.FindAsync(id);
        if (recipe is null) return null;

        recipe.Name = dto.Name;
        recipe.Description = dto.Description;
        recipe.Ingredients = dto.Ingredients;
        recipe.Instructions = dto.Instructions;
        recipe.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return ToDto(recipe);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var recipe = await db.Recipes.FindAsync(id);
        if (recipe is null) return false;

        db.Recipes.Remove(recipe);
        await db.SaveChangesAsync();

        return true;
    }

    private static RecipeDto ToDto(Recipe r) => new(
        r.Id, r.Name, r.Description, r.Ingredients, r.Instructions, r.CreatedAt, r.UpdatedAt);
}
