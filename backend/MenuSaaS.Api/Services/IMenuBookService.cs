using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Services;

public interface IMenuBookService
{
    IReadOnlyList<MenuBook> GetBooks();
    MenuBook? GetBySlug(string slug);
    MenuBook Create(CreateMenuBookRequest request);
    IReadOnlyList<ThemePreset> GetThemes();
}
