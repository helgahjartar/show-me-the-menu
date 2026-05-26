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
            return new AppSettingsDto(HasApiKey: false, HasKronanApiKey: false, UpdatedAt: DateTime.UnixEpoch);
        }
        return new AppSettingsDto(
            HasApiKey: !string.IsNullOrWhiteSpace(settings.AnthropicApiKey),
            HasKronanApiKey: !string.IsNullOrWhiteSpace(settings.KronanApiKey),
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
                KronanApiKey = dto.KronanApiKey,
                UpdatedAt = DateTime.UtcNow
            };
            _db.AppSettings.Add(settings);
        }
        else
        {
            if (dto.AnthropicApiKey is not null)
                settings.AnthropicApiKey = dto.AnthropicApiKey;
            if (dto.KronanApiKey is not null)
                settings.KronanApiKey = dto.KronanApiKey;
            settings.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return new AppSettingsDto(
            HasApiKey: !string.IsNullOrWhiteSpace(settings.AnthropicApiKey),
            HasKronanApiKey: !string.IsNullOrWhiteSpace(settings.KronanApiKey),
            UpdatedAt: settings.UpdatedAt);
    }

    public async Task<string?> GetApiKeyAsync(string userId)
    {
        var settings = await _db.AppSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        return settings?.AnthropicApiKey;
    }
}
