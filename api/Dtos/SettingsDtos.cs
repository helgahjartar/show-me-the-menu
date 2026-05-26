namespace ShowMeTheMenu.Api.Dtos;

public record AppSettingsDto(bool HasApiKey, bool HasKronanApiKey, DateTime UpdatedAt);
public record UpdateSettingsDto(string? AnthropicApiKey, string? KronanApiKey);
