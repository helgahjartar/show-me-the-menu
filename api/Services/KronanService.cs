using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public class KronanService(HttpClient httpClient, SettingsService settingsService)
{
    private const string BaseUrl = "https://api.kronan.is/api/v1";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

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

    public async Task<List<KronanProductStatsDto>> GetPurchaseStatsAsync(string userId)
    {
        var apiKey = await settingsService.GetKronanApiKeyAsync(userId);
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("No Krónan API key configured. Please add your Krónan API key in Settings.");

        const int pageSize = 100;

        var firstPage = await FetchStatsPage(apiKey, $"{BaseUrl}/product-purchase-stats/?limit={pageSize}");
        if (firstPage is null) return [];

        var results = firstPage.Results.Select(MapToDto).ToList();

        var totalPages = (int)Math.Ceiling((double)firstPage.Count / pageSize);
        if (totalPages > 1)
        {
            var remainingPages = await Task.WhenAll(
                Enumerable.Range(1, totalPages - 1).Select(i =>
                    FetchStatsPage(apiKey, $"{BaseUrl}/product-purchase-stats/?limit={pageSize}&offset={i * pageSize}")));

            foreach (var page in remainingPages.OfType<KronanStatsPage>())
                results.AddRange(page.Results.Select(MapToDto));
        }

        return results;
    }

    private async Task<KronanStatsPage?> FetchStatsPage(string apiKey, string url)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("AccessToken", apiKey);
        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<KronanStatsPage>(JsonOptions);
    }

    private static KronanProductStatsDto MapToDto(KronanStatItem r) => new(
        r.Id, r.Product.Name, r.Product.CategoryPath, r.PurchaseCount, r.QuantityPurchased,
        r.AveragePurchaseQuantity, r.AveragePurchaseIntervalDays,
        r.FirstPurchaseDate, r.LastPurchaseDate);

    private record KronanStatsPage(int Count, string? Next, List<KronanStatItem> Results);
    private record KronanStatItem(int Id, KronanProductItem Product, int PurchaseCount,
        int QuantityPurchased, double? AveragePurchaseQuantity, double? AveragePurchaseIntervalDays,
        string? FirstPurchaseDate, string? LastPurchaseDate, bool IsIgnored);
    private record KronanProductItem(string Sku, string Name, string? CategoryPath);
}
