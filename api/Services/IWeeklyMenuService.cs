using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IWeeklyMenuService
{
    Task<List<WeeklyMenuSummaryDto>> GetAllAsync(string userId);
    Task<WeeklyMenuDto?> GetByIdAsync(int id, string userId);
    Task<WeeklyMenuDto> CreateAsync(CreateWeeklyMenuDto dto, string userId);
    Task<WeeklyMenuDto?> UpdateAsync(int id, UpdateWeeklyMenuDto dto, string userId);
    Task<bool> DeleteAsync(int id, string userId);
    Task<WeeklyMenuDto?> SetItemsAsync(int id, SetMenuItemsDto dto, string userId);
}
