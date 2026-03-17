using System.Security.Claims;
using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Extensions;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class SettingsEndpoints
{
    public static void MapSettingsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/settings").WithTags("Settings").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, ISettingsService service) =>
            Results.Ok(await service.GetAsync(user.GetUserId())));

        group.MapPut("/", async (UpdateSettingsDto dto, ClaimsPrincipal user, ISettingsService service, ILoggerFactory loggerFactory) =>
        {
            var logger = loggerFactory.CreateLogger("SettingsEndpoints");
            var userId = user.GetUserId();
            var result = await service.UpdateAsync(dto, userId);
            logger.LogInformation("API key updated for user {UserId}", userId);
            return Results.Ok(result);
        });
    }
}
