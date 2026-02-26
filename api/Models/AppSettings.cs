namespace ShowMeTheMenu.Api.Models;

public class AppSettings
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public string? AnthropicApiKey { get; set; }
    public DateTime UpdatedAt { get; set; }
}
