using MenuSaaS.Api.Data;
using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Services;

public class MenuBookService(DemoStore store) : IMenuBookService
{
    public IReadOnlyList<MenuBook> GetBooks() => store.Books.OrderByDescending(x => x.UpdatedAtUtc).ToList();

    public MenuBook? GetBySlug(string slug) => store.Books.FirstOrDefault(x => x.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));

    public MenuBook Create(CreateMenuBookRequest request)
    {
        var book = new MenuBook
        {
            RestaurantName = request.RestaurantName,
            Title = request.Title,
            Slug = request.Slug,
            Description = request.Description,
            ThemeId = request.ThemeId,
            Status = "draft",
            UpdatedAtUtc = DateTime.UtcNow
        };
        store.Books.Add(book);
        return book;
    }

    public IReadOnlyList<ThemePreset> GetThemes() => store.Themes;
}
