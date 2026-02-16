using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class RecipeEndpoints
{
    public static void MapRecipeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/recipes").WithTags("Recipes");

        group.MapGet("/", async (IRecipeService service) =>
            Results.Ok(await service.GetAllAsync()));

        group.MapGet("/{id:int}", async (int id, IRecipeService service) =>
            await service.GetByIdAsync(id) is { } recipe
                ? Results.Ok(recipe)
                : Results.NotFound());

        group.MapPost("/", async (CreateRecipeDto dto, IRecipeService service) =>
        {
            var recipe = await service.CreateAsync(dto);
            return Results.Created($"/api/recipes/{recipe.Id}", recipe);
        });

        group.MapPut("/{id:int}", async (int id, UpdateRecipeDto dto, IRecipeService service) =>
            await service.UpdateAsync(id, dto) is { } recipe
                ? Results.Ok(recipe)
                : Results.NotFound());

        group.MapDelete("/{id:int}", async (int id, IRecipeService service) =>
            await service.DeleteAsync(id)
                ? Results.NoContent()
                : Results.NotFound());
    }
}
