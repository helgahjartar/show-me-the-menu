namespace ShowMeTheMenu.Api.Dtos;

public record InventoryItemDto(int Id, string Category, string Name, int Quantity, bool IsCrossed, DateTime CreatedAt);

public record CreateInventoryItemDto(string Category, string Name, int Quantity);

public record UpdateInventoryItemDto(bool IsCrossed, int? Quantity);
