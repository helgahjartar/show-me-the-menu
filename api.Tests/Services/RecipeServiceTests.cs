using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using Xunit;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Tests.Services;

public class RecipeServiceTests
{
    private static AppDbContext CreateDb() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyUsersRecipes()
    {
        using var db = CreateDb();
        db.Recipes.AddRange(
            new Recipe { UserId = "user1", Name = "Pasta", Ingredients = "pasta", Instructions = "cook", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Recipe { UserId = "user2", Name = "Salad", Ingredients = "lettuce", Instructions = "toss", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        );
        await db.SaveChangesAsync();

        var result = await new RecipeService(db).GetAllAsync("user1");

        Assert.Single(result);
        Assert.Equal("Pasta", result[0].Name);
    }

    [Fact]
    public async Task GetAllAsync_OrdersByUpdatedAtDescending()
    {
        using var db = CreateDb();
        db.Recipes.AddRange(
            new Recipe { UserId = "u", Name = "Older", Ingredients = "x", Instructions = "x", CreatedAt = DateTime.UtcNow.AddDays(-2), UpdatedAt = DateTime.UtcNow.AddDays(-2) },
            new Recipe { UserId = "u", Name = "Newer", Ingredients = "x", Instructions = "x", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        );
        await db.SaveChangesAsync();

        var result = await new RecipeService(db).GetAllAsync("u");

        Assert.Equal("Newer", result[0].Name);
        Assert.Equal("Older", result[1].Name);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenRecipeBelongsToAnotherUser()
    {
        using var db = CreateDb();
        var recipe = new Recipe { UserId = "user2", Name = "Pasta", Ingredients = "pasta", Instructions = "cook", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();

        var result = await new RecipeService(db).GetByIdAsync(recipe.Id, "user1");

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_PersistsAllFields()
    {
        using var db = CreateDb();
        var dto = new CreateRecipeDto("Tacos", "Crispy tacos", "chicken, tortillas", "Fry chicken, wrap");

        var result = await new RecipeService(db).CreateAsync(dto, "user1");

        Assert.Equal("Tacos", result.Name);
        Assert.Equal("Crispy tacos", result.Description);
        Assert.Equal("chicken, tortillas", result.Ingredients);
        Assert.Equal("Fry chicken, wrap", result.Instructions);
        Assert.Equal(1, await db.Recipes.CountAsync());
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenRecipeDoesNotExist()
    {
        using var db = CreateDb();
        var dto = new UpdateRecipeDto("New Name", null, "x", "y");

        var result = await new RecipeService(db).UpdateAsync(999, dto, "user1");

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_AndLeavesRecipeIntact_WhenRecipeBelongsToAnotherUser()
    {
        using var db = CreateDb();
        var recipe = new Recipe { UserId = "user2", Name = "Pasta", Ingredients = "pasta", Instructions = "cook", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();

        var result = await new RecipeService(db).DeleteAsync(recipe.Id, "user1");

        Assert.False(result);
        Assert.Equal(1, await db.Recipes.CountAsync());
    }
}
