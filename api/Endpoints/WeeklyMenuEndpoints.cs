using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class WeeklyMenuEndpoints
{
    public static void MapWeeklyMenuEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/menus").WithTags("Menus");

        group.MapGet("/", async (IWeeklyMenuService service) =>
            Results.Ok(await service.GetAllAsync()));

        group.MapGet("/{id:int}", async (int id, IWeeklyMenuService service) =>
            await service.GetByIdAsync(id) is { } menu
                ? Results.Ok(menu)
                : Results.NotFound());

        group.MapPost("/", async (CreateWeeklyMenuDto dto, IWeeklyMenuService service) =>
        {
            var menu = await service.CreateAsync(dto);
            return Results.Created($"/api/menus/{menu.Id}", menu);
        });

        group.MapPut("/{id:int}", async (int id, UpdateWeeklyMenuDto dto, IWeeklyMenuService service) =>
            await service.UpdateAsync(id, dto) is { } menu
                ? Results.Ok(menu)
                : Results.NotFound());

        group.MapDelete("/{id:int}", async (int id, IWeeklyMenuService service) =>
            await service.DeleteAsync(id)
                ? Results.NoContent()
                : Results.NotFound());

        group.MapPut("/{id:int}/items", async (int id, SetMenuItemsDto dto, IWeeklyMenuService service) =>
            await service.SetItemsAsync(id, dto) is { } menu
                ? Results.Ok(menu)
                : Results.NotFound());
    }
}
