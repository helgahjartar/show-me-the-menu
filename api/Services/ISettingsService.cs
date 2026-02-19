using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface ISettingsService
{
    Task<AppSettingsDto> GetAsync();
    Task<AppSettingsDto> UpdateAsync(UpdateSettingsDto dto);
    Task<string?> GetApiKeyAsync();
}
