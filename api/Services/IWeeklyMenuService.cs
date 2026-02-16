using ShowMeTheMenu.Api.Dtos;

namespace ShowMeTheMenu.Api.Services;

public interface IWeeklyMenuService
{
    Task<List<WeeklyMenuSummaryDto>> GetAllAsync();
    Task<WeeklyMenuDto?> GetByIdAsync(int id);
    Task<WeeklyMenuDto> CreateAsync(CreateWeeklyMenuDto dto);
    Task<WeeklyMenuDto?> UpdateAsync(int id, UpdateWeeklyMenuDto dto);
    Task<bool> DeleteAsync(int id);
    Task<WeeklyMenuDto?> SetItemsAsync(int id, SetMenuItemsDto dto);
}
