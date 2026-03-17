using System.Security.Claims;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Extensions;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class RecipeEndpoints
{
    public static void MapRecipeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/recipes").WithTags("Recipes").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IRecipeService service) =>
            Results.Ok(await service.GetAllAsync(user.GetUserId())));

        group.MapGet("/tags", async (ClaimsPrincipal user, IRecipeService service) =>
            Results.Ok(await service.GetAllTagsAsync(user.GetUserId())));

        group.MapGet("/{id:int}", async (int id, ClaimsPrincipal user, IRecipeService service) =>
            await service.GetByIdAsync(id, user.GetUserId()) is { } recipe
                ? Results.Ok(recipe)
                : Results.NotFound());

        group.MapPost("/", async (CreateRecipeDto dto, ClaimsPrincipal user, IRecipeService service) =>
        {
            var recipe = await service.CreateAsync(dto, user.GetUserId());
            return Results.Created($"/api/recipes/{recipe.Id}", recipe);
        });

        group.MapPut("/{id:int}", async (int id, UpdateRecipeDto dto, ClaimsPrincipal user, IRecipeService service) =>
            await service.UpdateAsync(id, dto, user.GetUserId()) is { } recipe
                ? Results.Ok(recipe)
                : Results.NotFound());

        group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, IRecipeService service) =>
            await service.DeleteAsync(id, user.GetUserId())
                ? Results.NoContent()
                : Results.NotFound());
    }
}
