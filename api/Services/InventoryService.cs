using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class InventoryService(AppDbContext db)
{
    public async Task<List<InventoryItemDto>> GetAllAsync(string userId)
    {
        return await db.InventoryItems
            .Where(i => i.UserId == userId)
            .OrderBy(i => i.CreatedAt)
            .Select(i => ToDto(i))
            .ToListAsync();
    }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto, string userId)
    {
        var item = new InventoryItem
        {
            UserId = userId,
            Category = dto.Category,
            Name = dto.Name,
            Quantity = Math.Max(1, dto.Quantity),
            IsCrossed = false,
            CreatedAt = DateTime.UtcNow
        };

        db.InventoryItems.Add(item);
        await db.SaveChangesAsync();

        return ToDto(item);
    }

    public async Task<InventoryItemDto?> UpdateAsync(int id, UpdateInventoryItemDto dto, string userId)
    {
        var item = await db.InventoryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (item is null) return null;

        item.IsCrossed = dto.IsCrossed;
        item.Quantity = Math.Max(1, dto.Quantity ?? item.Quantity);
        await db.SaveChangesAsync();

        return ToDto(item);
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var item = await db.InventoryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (item is null) return false;

        db.InventoryItems.Remove(item);
        await db.SaveChangesAsync();

        return true;
    }

    private static InventoryItemDto ToDto(InventoryItem i) =>
        new(i.Id, i.Category, i.Name, i.Quantity, i.IsCrossed, i.CreatedAt);
}
