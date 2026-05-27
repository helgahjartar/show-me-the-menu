namespace ShowMeTheMenu.Api.Dtos;

public record KronanProductStatsDto(
    int Id,
    string ProductName,
    string? CategoryPath,
    int PurchaseCount,
    int QuantityPurchased,
    double? AveragePurchaseQuantity,
    double? AveragePurchaseIntervalDays,
    string? FirstPurchaseDate,
    string? LastPurchaseDate
);
