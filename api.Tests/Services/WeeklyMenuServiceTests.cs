using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using Xunit;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Tests.Services;

public class WeeklyMenuServiceTests
{
    private static AppDbContext CreateDb() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyUsersMenus_OrderedByStartDateDescending()
    {
        using var db = CreateDb();
        var now = DateTime.UtcNow;
        db.WeeklyMenus.AddRange(
            new WeeklyMenu { UserId = "user1", Name = "Old Menu", StartDate = new DateOnly(2026, 1, 6), CreatedAt = now, UpdatedAt = now },
            new WeeklyMenu { UserId = "user1", Name = "New Menu", StartDate = new DateOnly(2026, 2, 3), CreatedAt = now, UpdatedAt = now },
            new WeeklyMenu { UserId = "user2", Name = "Other User", StartDate = new DateOnly(2026, 3, 1), CreatedAt = now, UpdatedAt = now }
        );
        await db.SaveChangesAsync();

        var result = await new WeeklyMenuService(db).GetAllAsync("user1");

        Assert.Equal(2, result.Count);
        Assert.Equal("New Menu", result[0].Name);
        Assert.Equal("Old Menu", result[1].Name);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenMenuBelongsToAnotherUser()
    {
        using var db = CreateDb();
        var now = DateTime.UtcNow;
        var menu = new WeeklyMenu { UserId = "user2", Name = "Menu", StartDate = new DateOnly(2026, 2, 3), CreatedAt = now, UpdatedAt = now };
        db.WeeklyMenus.Add(menu);
        await db.SaveChangesAsync();

        var result = await new WeeklyMenuService(db).GetByIdAsync(menu.Id, "user1");

        Assert.Null(result);
    }

    [Fact]
    public async Task SetItemsAsync_ReplacesAllExistingItems()
    {
        using var db = CreateDb();
        var now = DateTime.UtcNow;
        var menu = new WeeklyMenu
        {
            UserId = "user1",
            Name = "Week",
            StartDate = new DateOnly(2026, 2, 3),
            CreatedAt = now,
            UpdatedAt = now,
            Items = [new MenuItem { DayOfWeek = 0, MealType = MealType.Dinner, CustomName = "Old Item" }]
        };
        db.WeeklyMenus.Add(menu);
        await db.SaveChangesAsync();

        var newItems = new SetMenuItemsDto([
            new SetMenuItemDto(0, MealType.Dinner, null, "Monday Dinner", null),
            new SetMenuItemDto(1, MealType.Dinner, null, "Tuesday Dinner", null),
        ]);

        var result = await new WeeklyMenuService(db).SetItemsAsync(menu.Id, newItems, "user1");

        Assert.NotNull(result);
        Assert.Equal(2, result.Items.Count);
        Assert.DoesNotContain(result.Items, i => i.CustomName == "Old Item");
        Assert.Equal(2, await db.MenuItems.CountAsync());
    }

    [Fact]
    public async Task SetItemsAsync_ReturnsNull_WhenMenuNotFound()
    {
        using var db = CreateDb();

        var result = await new WeeklyMenuService(db).SetItemsAsync(999, new SetMenuItemsDto([]), "user1");

        Assert.Null(result);
    }
}
