using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IFridgeSuggestionService
{
    Task<FridgeSuggestionResponseDto> SuggestAsync(FridgeSuggestionRequestDto request, string userId);
}
