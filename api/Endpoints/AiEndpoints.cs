using System.Security.Claims;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Extensions;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class AiEndpoints
{
    public static void MapAiEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/ai").WithTags("AI").RequireAuthorization();

        group.MapPost("/suggest", async (AiSuggestRequestDto request, IAiSuggestionService service) =>
            Results.Ok(await service.SuggestAsync(request)));

        group.MapPost("/fridge-suggestion", async (FridgeSuggestionRequestDto request, ClaimsPrincipal user, IFridgeSuggestionService service) =>
        {
            try
            {
                var result = await service.SuggestAsync(request, user.GetUserId());
                return Results.Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}
