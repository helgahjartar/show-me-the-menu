using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class AiEndpoints
{
    public static void MapAiEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/ai").WithTags("AI");

        group.MapPost("/suggest", async (AiSuggestRequestDto request, IAiSuggestionService service) =>
            Results.Ok(await service.SuggestAsync(request)));
    }
}
