using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Services;

public interface IMenuBookService
{
    IReadOnlyList<MenuBook> GetBooks();
    MenuBook? GetBySlug(string slug);
    MenuBook Create(CreateMenuBookRequest request);
    MenuBook? Update(Guid id, UpdateMenuBookRequest request);
    MenuBook? SetPublication(Guid id, bool publish);
    IReadOnlyList<ThemePreset> GetThemes();
    IReadOnlyList<AssetItem> GetAssets();
    DashboardSummaryResponse GetDashboardSummary();
}
