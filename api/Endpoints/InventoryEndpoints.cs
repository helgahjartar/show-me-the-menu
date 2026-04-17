using System.Security.Claims;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Extensions;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class InventoryEndpoints
{
    public static void MapInventoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/inventory").WithTags("Inventory").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, InventoryService service) =>
            Results.Ok(await service.GetAllAsync(user.GetUserId())));

        group.MapPost("/", async (CreateInventoryItemDto dto, ClaimsPrincipal user, InventoryService service) =>
        {
            var item = await service.CreateAsync(dto, user.GetUserId());
            return Results.Created($"/api/inventory/{item.Id}", item);
        });

        group.MapPut("/{id:int}", async (int id, UpdateInventoryItemDto dto, ClaimsPrincipal user, InventoryService service) =>
            await service.UpdateAsync(id, dto, user.GetUserId()) is { } item
                ? Results.Ok(item)
                : Results.NotFound());

        group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, InventoryService service) =>
            await service.DeleteAsync(id, user.GetUserId())
                ? Results.NoContent()
                : Results.NotFound());
    }
}
