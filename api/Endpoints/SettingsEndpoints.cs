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

        group.MapPut("/", async (UpdateSettingsDto dto, ClaimsPrincipal user, ISettingsService service) =>
            Results.Ok(await service.UpdateAsync(dto, user.GetUserId())));
    }
}
