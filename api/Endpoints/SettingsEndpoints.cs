using ShowMeTheMenu.Api.Dtos;
using ShowMeTheMenu.Api.Services;

namespace ShowMeTheMenu.Api.Endpoints;

public static class SettingsEndpoints
{
    public static void MapSettingsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/settings").WithTags("Settings");

        group.MapGet("/", async (ISettingsService service) =>
            Results.Ok(await service.GetAsync()));

        group.MapPut("/", async (UpdateSettingsDto dto, ISettingsService service) =>
            Results.Ok(await service.UpdateAsync(dto)));
    }
}
