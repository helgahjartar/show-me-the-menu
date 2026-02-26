using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IMenuGenerationService
{
    Task<WeeklyMenuDto> GenerateAsync(GenerateMenuDto request, string userId);
}
