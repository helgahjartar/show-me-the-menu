using System.Net.Http.Headers;

namespace ShowMeTheMenu.Api.Services;

public class KronanService(HttpClient httpClient, SettingsService settingsService)
{
    private const string BaseUrl = "https://api.kronan.is/api/v1";

    public async Task AddToShoppingListAsync(IEnumerable<string> ingredients, string userId)
    {
        var apiKey = await settingsService.GetKronanApiKeyAsync(userId);
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("No Krónan API key configured. Please add your Krónan API key in Settings.");

        var lines = ingredients
            .Select(i => i.Trim())
            .Where(i => i.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(i => i, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (lines.Count == 0)
            throw new InvalidOperationException("No ingredients to add to the shopping list.");

        foreach (var batch in lines.Chunk(30))
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/shopping-notes/add-lines/");
            request.Headers.Authorization = new AuthenticationHeaderValue("AccessToken", apiKey);
            request.Content = JsonContent.Create(new
            {
                lines = batch.Select(text => new { text })
            });

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }
}
