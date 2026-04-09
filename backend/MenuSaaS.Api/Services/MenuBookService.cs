using MenuSaaS.Api.Data;
using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Services;

public class MenuBookService(DemoStore store, IWebHostEnvironment environment) : IMenuBookService
{
    public IReadOnlyList<MenuBook> GetBooks() => store.Books.OrderByDescending(x => x.UpdatedAtUtc).ToList();

    public MenuBook? GetBySlug(string slug)
    {
        var book = store.Books.FirstOrDefault(x => x.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        if (book is not null) book.Views += 1;
        return book;
    }

    public MenuBook? GetById(Guid id) => store.Books.FirstOrDefault(x => x.Id == id);

    public MenuBook Create(CreateMenuBookRequest request)
    {
        ValidateCreate(request);
        EnsureSlugAvailable(request.Slug, null);

        var book = new MenuBook
        {
            RestaurantName = request.RestaurantName.Trim(),
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = request.Description?.Trim(),
            ThemeId = request.ThemeId,
            Status = request.Publish ? "published" : "draft",
            UpdatedAtUtc = DateTime.UtcNow,
            Pages = SavePages(request.Slug, request.Pages, 0)
        };

        book.CoverImageUrl = book.Pages.FirstOrDefault()?.ImageUrl;
        store.Books.Add(book);
        return book;
    }

    public MenuBook Update(Guid id, UpdateMenuBookRequest request)
    {
        var book = GetById(id) ?? throw new InvalidOperationException("المنيو غير موجود.");
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Slug))
        {
            throw new InvalidOperationException("العنوان والرابط المختصر مطلوبان.");
        }

        EnsureSlugAvailable(request.Slug, id);
        book.RestaurantName = request.RestaurantName.Trim();
        book.Title = request.Title.Trim();
        book.Slug = request.Slug.Trim().ToLowerInvariant();
        book.Description = request.Description?.Trim();
        book.ThemeId = request.ThemeId;
        book.Status = request.Publish ? "published" : "draft";
        book.UpdatedAtUtc = DateTime.UtcNow;
        return book;
    }

    public MenuBook AddPages(Guid id, AddPagesRequest request)
    {
        var book = GetById(id) ?? throw new InvalidOperationException("المنيو غير موجود.");
        if (request.Pages.Count == 0)
        {
            throw new InvalidOperationException("لا توجد صفحات لإضافتها.");
        }

        var nextOrder = (book.Pages.Any() ? book.Pages.Max(p => p.Order) : 0);
        var pages = SavePages(book.Slug, request.Pages, nextOrder);
        book.Pages.AddRange(pages);
        book.Pages = book.Pages.OrderBy(p => p.Order).ToList();
        book.CoverImageUrl ??= book.Pages.FirstOrDefault()?.ImageUrl;
        book.UpdatedAtUtc = DateTime.UtcNow;
        return book;
    }

    public void Delete(Guid id)
    {
        var book = GetById(id);
        if (book is null) return;
        store.Books.Remove(book);
    }

    public void DeletePage(Guid bookId, Guid pageId)
    {
        var book = GetById(bookId) ?? throw new InvalidOperationException("المنيو غير موجود.");
        var page = book.Pages.FirstOrDefault(x => x.Id == pageId) ?? throw new InvalidOperationException("الصفحة غير موجودة.");
        book.Pages.Remove(page);
        book.Pages = book.Pages.OrderBy(p => p.Order).Select((p, index) =>
        {
            p.Order = index + 1;
            return p;
        }).ToList();
        book.CoverImageUrl = book.Pages.FirstOrDefault()?.ImageUrl;
        book.UpdatedAtUtc = DateTime.UtcNow;
    }

    public IReadOnlyList<ThemePreset> GetThemes() => store.Themes;

    private void ValidateCreate(CreateMenuBookRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Slug))
        {
            throw new InvalidOperationException("العنوان والرابط المختصر مطلوبان.");
        }

        if (request.Pages.Count == 0)
        {
            throw new InvalidOperationException("يجب رفع PDF ليتم إنشاء صفحات المنيو.");
        }
    }

    private void EnsureSlugAvailable(string slug, Guid? currentBookId)
    {
        if (store.Books.Any(x => x.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase) && x.Id != currentBookId))
        {
            throw new InvalidOperationException("هذا الرابط المختصر مستخدم بالفعل.");
        }
    }

    private List<MenuPage> SavePages(string slug, List<CreateMenuPageRequest> pages, int startOrder)
    {
        var folder = Path.Combine(environment.ContentRootPath, "wwwroot", "uploads", "menubooks", slug);
        Directory.CreateDirectory(folder);
        var result = new List<MenuPage>();

        foreach (var page in pages.OrderBy(x => x.Order))
        {
            if (string.IsNullOrWhiteSpace(page.ImageBase64)) continue;
            var order = startOrder + page.Order;
            var relativePath = SaveImage(folder, slug, order, page.ImageBase64);
            result.Add(new MenuPage
            {
                Title = string.IsNullOrWhiteSpace(page.Title) ? $"Page {order}" : page.Title,
                Order = order,
                ImageUrl = relativePath
            });
        }

        return result;
    }

    private static string SaveImage(string folder, string slug, int order, string imageBase64)
    {
        var commaIndex = imageBase64.IndexOf(',');
        var rawBase64 = commaIndex >= 0 ? imageBase64[(commaIndex + 1)..] : imageBase64;
        var bytes = Convert.FromBase64String(rawBase64);
        var fileName = $"{slug}-page-{order:D3}.jpg";
        var filePath = Path.Combine(folder, fileName);
        File.WriteAllBytes(filePath, bytes);
        return $"/uploads/menubooks/{slug}/{fileName}";
    }
}
