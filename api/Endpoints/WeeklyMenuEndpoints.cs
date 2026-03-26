using System.Security.Claims;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Extensions;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class WeeklyMenuEndpoints
{
    public static void MapWeeklyMenuEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/menus").WithTags("Menus").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, WeeklyMenuService service) =>
            Results.Ok(await service.GetAllAsync(user.GetUserId())));

        group.MapGet("/{id:int}", async (int id, ClaimsPrincipal user, WeeklyMenuService service) =>
            await service.GetByIdAsync(id, user.GetUserId()) is { } menu
                ? Results.Ok(menu)
                : Results.NotFound());

        group.MapPost("/", async (CreateWeeklyMenuDto dto, ClaimsPrincipal user, WeeklyMenuService service) =>
        {
            var menu = await service.CreateAsync(dto, user.GetUserId());
            return Results.Created($"/api/menus/{menu.Id}", menu);
        });

        group.MapPut("/{id:int}", async (int id, UpdateWeeklyMenuDto dto, ClaimsPrincipal user, WeeklyMenuService service) =>
            await service.UpdateAsync(id, dto, user.GetUserId()) is { } menu
                ? Results.Ok(menu)
                : Results.NotFound());

        group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, WeeklyMenuService service) =>
            await service.DeleteAsync(id, user.GetUserId())
                ? Results.NoContent()
                : Results.NotFound());

        group.MapPut("/{id:int}/items", async (int id, SetMenuItemsDto dto, ClaimsPrincipal user, WeeklyMenuService service) =>
            await service.SetItemsAsync(id, dto, user.GetUserId()) is { } menu
                ? Results.Ok(menu)
                : Results.NotFound());

        group.MapGet("/{id:int}/shopping-list", async (int id, ClaimsPrincipal user, WeeklyMenuService service) =>
            await service.GetShoppingListAsync(id, user.GetUserId()) is { } list
                ? Results.Ok(list)
                : Results.NotFound());

        group.MapPost("/generate", async (GenerateMenuDto? dto, ClaimsPrincipal user, MenuGenerationService generationService) =>
        {
            try
            {
                var result = await generationService.GenerateAsync(dto ?? new GenerateMenuDto(null, null, null, null), user.GetUserId());
                return Results.Created($"/api/menus/{result.Id}", result);
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        }).RequireRateLimiting("ai");
    }
}
