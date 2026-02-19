namespace ShowMeTheMenu.Api.Dtos;

public record AppSettingsDto(bool HasApiKey, DateTime UpdatedAt);
public record UpdateSettingsDto(string AnthropicApiKey);
