using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class WeeklyMenuService(AppDbContext db) : IWeeklyMenuService
{
    public async Task<List<WeeklyMenuSummaryDto>> GetAllAsync(string userId)
    {
        return await db.WeeklyMenus
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.StartDate)
            .Select(m => new WeeklyMenuSummaryDto(
                m.Id, m.Name, m.StartDate, m.Items.Count, m.CreatedAt))
            .ToListAsync();
    }

    public async Task<WeeklyMenuDto?> GetByIdAsync(int id, string userId)
    {
        var menu = await db.WeeklyMenus
            .Include(m => m.Items)
                .ThenInclude(i => i.Recipe)
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        return menu is null ? null : ToDto(menu);
    }

    public async Task<WeeklyMenuDto> CreateAsync(CreateWeeklyMenuDto dto, string userId)
    {
        var now = DateTime.UtcNow;
        var menu = new WeeklyMenu
        {
            UserId = userId,
            Name = dto.Name,
            StartDate = dto.StartDate,
            CreatedAt = now,
            UpdatedAt = now
        };

        db.WeeklyMenus.Add(menu);
        await db.SaveChangesAsync();

        return ToDto(menu);
    }

    public async Task<WeeklyMenuDto?> UpdateAsync(int id, UpdateWeeklyMenuDto dto, string userId)
    {
        var menu = await db.WeeklyMenus
            .Include(m => m.Items)
                .ThenInclude(i => i.Recipe)
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (menu is null) return null;

        menu.Name = dto.Name;
        menu.StartDate = dto.StartDate;
        menu.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return ToDto(menu);
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var menu = await db.WeeklyMenus.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);
        if (menu is null) return false;

        db.WeeklyMenus.Remove(menu);
        await db.SaveChangesAsync();

        return true;
    }

    public async Task<WeeklyMenuDto?> SetItemsAsync(int id, SetMenuItemsDto dto, string userId)
    {
        var menu = await db.WeeklyMenus
            .Include(m => m.Items)
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (menu is null) return null;

        // Remove existing items
        db.MenuItems.RemoveRange(menu.Items);

        // Add new items
        menu.Items = dto.Items.Select(item => new MenuItem
        {
            WeeklyMenuId = id,
            DayOfWeek = item.DayOfWeek,
            MealType = item.MealType,
            RecipeId = item.RecipeId,
            CustomName = item.CustomName,
            Notes = item.Notes
        }).ToList();

        menu.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        // Reload with recipe names
        await db.Entry(menu).Collection(m => m.Items).Query()
            .Include(i => i.Recipe).LoadAsync();

        return ToDto(menu);
    }

    private static WeeklyMenuDto ToDto(WeeklyMenu m) => new(
        m.Id, m.Name, m.StartDate, m.CreatedAt, m.UpdatedAt,
        m.Items.Select(i => new MenuItemDto(
            i.Id, i.DayOfWeek, i.MealType, i.RecipeId,
            i.Recipe?.Name, i.CustomName, i.Notes)).ToList());
}
