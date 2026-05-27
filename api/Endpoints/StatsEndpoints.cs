using System.Security.Claims;
using ShowMeTheMenu.Api.Extensions;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class StatsEndpoints
{
    public static void MapStatsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/stats").WithTags("Stats").RequireAuthorization();

        group.MapGet("/kronan", async (ClaimsPrincipal user, KronanService kronanService) =>
        {
            try
            {
                var stats = await kronanService.GetPurchaseStatsAsync(user.GetUserId());
                return Results.Ok(stats);
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}
