
using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Services;

public interface IMenuBookService
{
    IReadOnlyList<MenuBook> GetBooks();
    MenuBook? GetBySlug(string slug);
    MenuBook? GetById(Guid id);
    MenuBook Create(CreateMenuBookRequest request);
    MenuBook Update(Guid id, UpdateMenuBookRequest request);
    MenuBook AddPages(Guid id, AddPagesRequest request);
    void Delete(Guid id);
    void DeletePage(Guid bookId, Guid pageId);
    IReadOnlyList<ThemePreset> GetThemes();
    MenuPage? GetPage(Guid bookId, Guid pageId);
    MenuPage? GetPage(string slug, Guid pageId);
}
