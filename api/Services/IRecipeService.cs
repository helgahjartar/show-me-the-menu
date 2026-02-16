using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IRecipeService
{
    Task<List<RecipeDto>> GetAllAsync();
    Task<RecipeDto?> GetByIdAsync(int id);
    Task<RecipeDto> CreateAsync(CreateRecipeDto dto);
    Task<RecipeDto?> UpdateAsync(int id, UpdateRecipeDto dto);
    Task<bool> DeleteAsync(int id);
}
