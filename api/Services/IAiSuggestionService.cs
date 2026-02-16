using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IAiSuggestionService
{
    Task<List<AiSuggestionDto>> SuggestAsync(AiSuggestRequestDto request);
}
