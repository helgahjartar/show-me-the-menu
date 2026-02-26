using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IRecipeService
{
    Task<List<RecipeDto>> GetAllAsync(string userId);
    Task<RecipeDto?> GetByIdAsync(int id, string userId);
    Task<RecipeDto> CreateAsync(CreateRecipeDto dto, string userId);
    Task<RecipeDto?> UpdateAsync(int id, UpdateRecipeDto dto, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}
