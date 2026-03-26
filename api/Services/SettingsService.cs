using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Services;

public class SettingsService
{
    private readonly AppDbContext _db;

    public SettingsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AppSettingsDto> GetAsync(string userId)
    {
        var settings = await _db.AppSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings is null)
        {
            return new AppSettingsDto(HasApiKey: false, UpdatedAt: DateTime.UnixEpoch);
        }
        return new AppSettingsDto(
            HasApiKey: !string.IsNullOrWhiteSpace(settings.AnthropicApiKey),
            UpdatedAt: settings.UpdatedAt);
    }

    public async Task<AppSettingsDto> UpdateAsync(UpdateSettingsDto dto, string userId)
    {
        var settings = await _db.AppSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings is null)
        {
            settings = new AppSettings
            {
                UserId = userId,
                AnthropicApiKey = dto.AnthropicApiKey,
                UpdatedAt = DateTime.UtcNow
            };
            _db.AppSettings.Add(settings);
        }
        else
        {
            settings.AnthropicApiKey = dto.AnthropicApiKey;
            settings.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return new AppSettingsDto(
            HasApiKey: !string.IsNullOrWhiteSpace(settings.AnthropicApiKey),
            UpdatedAt: settings.UpdatedAt);
    }

    public async Task<string?> GetApiKeyAsync(string userId)
    {
        var settings = await _db.AppSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        return settings?.AnthropicApiKey;
    }
}
