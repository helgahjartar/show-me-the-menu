using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Tests.Services;

public class MenuGenerationServiceTests
{
    private readonly Mock<IRecipeService> _recipes = new();
    private readonly Mock<IWeeklyMenuService> _menus = new();
    private readonly Mock<ISettingsService> _settings = new();
    private readonly Mock<ILogger<MenuGenerationService>> _logger = new();

    private MenuGenerationService CreateService() =>
        new(_recipes.Object, _menus.Object, _settings.Object, _logger.Object);

    [Fact]
    public async Task GenerateAsync_ThrowsInvalidOperationException_WhenNoRecipesExist()
    {
        _recipes.Setup(s => s.GetAllAsync("user1")).ReturnsAsync([]);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => CreateService().GenerateAsync(new GenerateMenuDto(null, null), "user1"));
    }

    [Fact]
    public async Task GenerateAsync_UsesProvidedNameAndDate()
    {
        var startDate = new DateOnly(2026, 3, 2);
        SetupHappyPath(startDate, "My Menu");

        await CreateService().GenerateAsync(new GenerateMenuDto("My Menu", startDate), "user1");

        _menus.Verify(s => s.CreateAsync(
            It.Is<CreateWeeklyMenuDto>(d => d.Name == "My Menu" && d.StartDate == startDate),
            "user1"), Times.Once);
    }

    [Fact]
    public async Task GenerateAsync_CreatesSevenDinnerItems_OnePerDay()
    {
        var startDate = new DateOnly(2026, 3, 2);
        SetMenuItemsDto? captured = null;

        _recipes.Setup(s => s.GetAllAsync("user1")).ReturnsAsync(MakeRecipes(3));
        _settings.Setup(s => s.GetApiKeyAsync("user1")).ReturnsAsync((string?)null);

        var createdMenu = StubMenu(1, "Week", startDate);
        _menus.Setup(s => s.CreateAsync(It.IsAny<CreateWeeklyMenuDto>(), "user1")).ReturnsAsync(createdMenu);
        _menus.Setup(s => s.SetItemsAsync(1, It.IsAny<SetMenuItemsDto>(), "user1"))
            .Callback<int, SetMenuItemsDto, string>((_, items, _) => captured = items)
            .ReturnsAsync(StubMenu(1, "Week", startDate));

        await CreateService().GenerateAsync(new GenerateMenuDto(null, startDate), "user1");

        Assert.NotNull(captured);
        Assert.Equal(7, captured!.Items.Count);
        Assert.All(captured.Items, item => Assert.Equal(MealType.Dinner, item.MealType));
        Assert.Equal(Enumerable.Range(0, 7), captured.Items.Select(i => i.DayOfWeek));
    }

    private void SetupHappyPath(DateOnly startDate, string name)
    {
        _recipes.Setup(s => s.GetAllAsync("user1")).ReturnsAsync(MakeRecipes(10));
        _settings.Setup(s => s.GetApiKeyAsync("user1")).ReturnsAsync((string?)null);
        _menus.Setup(s => s.CreateAsync(It.IsAny<CreateWeeklyMenuDto>(), "user1"))
            .ReturnsAsync(StubMenu(1, name, startDate));
        _menus.Setup(s => s.SetItemsAsync(It.IsAny<int>(), It.IsAny<SetMenuItemsDto>(), "user1"))
            .ReturnsAsync(StubMenu(1, name, startDate));
    }

    private static WeeklyMenuDto StubMenu(int id, string name, DateOnly startDate) =>
        new(id, name, startDate, DateTime.UtcNow, DateTime.UtcNow, []);

    private static List<RecipeDto> MakeRecipes(int count) =>
        Enumerable.Range(1, count)
            .Select(i => new RecipeDto(i, $"Recipe {i}", null, "ingredients", "instructions", DateTime.UtcNow, DateTime.UtcNow))
            .ToList();
}
