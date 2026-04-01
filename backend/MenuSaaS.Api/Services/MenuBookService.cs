using MenuSaaS.Api.Data;
using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Services;

public class MenuBookService(DemoStore store) : IMenuBookService
{
    public IReadOnlyList<MenuBook> GetBooks() => store.Books
        .OrderByDescending(x => x.UpdatedAtUtc)
        .ToList();

    public MenuBook? GetBySlug(string slug) => store.Books
        .FirstOrDefault(x => x.Slug.Equals(slug.Trim(), StringComparison.OrdinalIgnoreCase));

    public MenuBook Create(CreateMenuBookRequest request)
    {
        EnsureThemeExists(request.ThemeId);
        EnsureUniqueSlug(request.Slug);

        var book = new MenuBook
        {
            RestaurantName = request.RestaurantName.Trim(),
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            ThemeId = request.ThemeId,
            Status = "draft",
            UpdatedAtUtc = DateTime.UtcNow,
            CoverImageUrl = "/demo/cover.jpg"
        };

        store.Books.Add(book);
        return book;
    }

    public MenuBook? Update(Guid id, UpdateMenuBookRequest request)
    {
        var book = store.Books.FirstOrDefault(x => x.Id == id);
        if (book is null)
        {
            return null;
        }

        EnsureThemeExists(request.ThemeId);

        book.RestaurantName = request.RestaurantName.Trim();
        book.Title = request.Title.Trim();
        book.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        book.ThemeId = request.ThemeId;
        book.Status = request.Status.Equals("published", StringComparison.OrdinalIgnoreCase) ? "published" : "draft";
        book.UpdatedAtUtc = DateTime.UtcNow;

        return book;
    }

    public MenuBook? SetPublication(Guid id, bool publish)
    {
        var book = store.Books.FirstOrDefault(x => x.Id == id);
        if (book is null)
        {
            return null;
        }

        book.Status = publish ? "published" : "draft";
        book.UpdatedAtUtc = DateTime.UtcNow;
        return book;
    }

    public IReadOnlyList<ThemePreset> GetThemes() => store.Themes;

    public IReadOnlyList<AssetItem> GetAssets() => store.Assets
        .OrderByDescending(x => x.UploadedAtUtc)
        .ToList();

    public DashboardSummaryResponse GetDashboardSummary()
    {
        var books = store.Books;
        return new DashboardSummaryResponse
        {
            TotalBooks = books.Count,
            PublishedBooks = books.Count(x => x.Status == "published"),
            DraftBooks = books.Count(x => x.Status != "published"),
            TotalPages = books.Sum(x => x.Pages.Count),
            TotalViews = books.Sum(x => x.Views),
            TotalThemes = store.Themes.Count,
            TotalAssets = store.Assets.Count
        };
    }

    private void EnsureUniqueSlug(string slug)
    {
        var normalized = slug.Trim().ToLowerInvariant();
        if (store.Books.Any(x => x.Slug.Equals(normalized, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A menu book with the same slug already exists.");
        }
    }

    private void EnsureThemeExists(string themeId)
    {
        if (!store.Themes.Any(x => x.Id == themeId))
        {
            throw new KeyNotFoundException("Theme was not found.");
        }
    }
}
