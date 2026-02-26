using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface ISettingsService
{
    Task<AppSettingsDto> GetAsync(string userId);
    Task<AppSettingsDto> UpdateAsync(UpdateSettingsDto dto, string userId);
    Task<string?> GetApiKeyAsync(string userId);
}
