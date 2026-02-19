using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public class SettingsService : ISettingsService
{
    private readonly AppDbContext _db;

    public SettingsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AppSettingsDto> GetAsync()
    {
        var settings = await _db.AppSettings.FirstAsync(s => s.Id == 1);
        return new AppSettingsDto(
            HasApiKey: !string.IsNullOrWhiteSpace(settings.AnthropicApiKey),
            UpdatedAt: settings.UpdatedAt);
    }

    public async Task<AppSettingsDto> UpdateAsync(UpdateSettingsDto dto)
    {
        var settings = await _db.AppSettings.FirstAsync(s => s.Id == 1);
        settings.AnthropicApiKey = dto.AnthropicApiKey;
        settings.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return new AppSettingsDto(
            HasApiKey: !string.IsNullOrWhiteSpace(settings.AnthropicApiKey),
            UpdatedAt: settings.UpdatedAt);
    }

    public async Task<string?> GetApiKeyAsync()
    {
        var settings = await _db.AppSettings.FirstAsync(s => s.Id == 1);
        return settings.AnthropicApiKey;
    }
}
