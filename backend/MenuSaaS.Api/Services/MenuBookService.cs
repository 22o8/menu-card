
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
        if (book is not null)
        {
            book.Views += 1;
            store.Save();
        }
        return book;
    }

    public MenuBook? GetById(Guid id) => store.Books.FirstOrDefault(x => x.Id == id);

    public MenuBook Create(CreateMenuBookRequest request)
    {
        ValidateCreate(request);
        var normalizedSlug = request.Slug.Trim().ToLowerInvariant();
        EnsureSlugAvailable(normalizedSlug, null);

        var book = new MenuBook
        {
            RestaurantName = request.RestaurantName.Trim(),
            Title = request.Title.Trim(),
            Slug = normalizedSlug,
            Description = request.Description?.Trim(),
            ThemeId = request.ThemeId,
            Status = request.Publish ? "published" : "draft",
            UpdatedAtUtc = DateTime.UtcNow,
            Pages = SavePages(normalizedSlug, request.Pages, 0)
        };

        book.CoverImageUrl = book.Pages.FirstOrDefault()?.ImageUrl;
        store.Books.Add(book);
        store.Save();
        return book;
    }

    public MenuBook Update(Guid id, UpdateMenuBookRequest request)
    {
        var book = GetById(id) ?? throw new InvalidOperationException("المنيو غير موجود.");
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Slug))
        {
            throw new InvalidOperationException("العنوان والرابط المختصر مطلوبان.");
        }

        var oldSlug = book.Slug;
        var newSlug = request.Slug.Trim().ToLowerInvariant();
        EnsureSlugAvailable(newSlug, id);
        book.RestaurantName = request.RestaurantName.Trim();
        book.Title = request.Title.Trim();
        book.Slug = newSlug;
        book.Description = request.Description?.Trim();
        book.ThemeId = request.ThemeId;
        book.Status = request.Publish ? "published" : "draft";
        book.UpdatedAtUtc = DateTime.UtcNow;

        if (!string.Equals(oldSlug, newSlug, StringComparison.OrdinalIgnoreCase))
        {
            foreach (var page in book.Pages)
            {
                page.ImageUrl = $"/api/menubooks/{newSlug}/pages/{page.Id}/image";
            }
        }

        store.Save();
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
        store.Save();
        return book;
    }

    public void Delete(Guid id)
    {
        var book = GetById(id);
        if (book is null) return;
        store.Books.Remove(book);
        store.Save();
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
        store.Save();
    }

    public IReadOnlyList<ThemePreset> GetThemes() => store.Themes;

    public MenuPage? GetPage(Guid bookId, Guid pageId)
    {
        var book = GetById(bookId);
        return book?.Pages.FirstOrDefault(x => x.Id == pageId);
    }

    public MenuPage? GetPage(string slug, Guid pageId)
    {
        var book = GetBySlugNoTracking(slug);
        return book?.Pages.FirstOrDefault(x => x.Id == pageId);
    }

    private MenuBook? GetBySlugNoTracking(string slug)
        => store.Books.FirstOrDefault(x => x.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));

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
            var (mimeType, rawBase64, bytes) = ParseImage(page.ImageBase64);
            var pageEntity = new MenuPage
            {
                Title = string.IsNullOrWhiteSpace(page.Title) ? $"Page {order}" : page.Title,
                Order = order,
                ImageMimeType = mimeType,
                ImageData = rawBase64
            };
            SaveImageFile(folder, slug, order, bytes);
            pageEntity.ImageUrl = $"/api/menubooks/{slug}/pages/{pageEntity.Id}/image";
            result.Add(pageEntity);
        }

        return result;
    }

    private static (string mimeType, string rawBase64, byte[] bytes) ParseImage(string imageBase64)
    {
        var mimeType = "image/jpeg";
        var rawBase64 = imageBase64;
        if (imageBase64.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
        {
            var parts = imageBase64.Split(',', 2);
            var header = parts[0];
            rawBase64 = parts.Length > 1 ? parts[1] : string.Empty;
            var mimeSegment = header[5..].Split(';', 2)[0];
            if (!string.IsNullOrWhiteSpace(mimeSegment)) mimeType = mimeSegment;
        }

        var bytes = Convert.FromBase64String(rawBase64);
        return (mimeType, rawBase64, bytes);
    }

    private static void SaveImageFile(string folder, string slug, int order, byte[] bytes)
    {
        var fileName = $"{slug}-page-{order:D3}.jpg";
        var filePath = Path.Combine(folder, fileName);
        File.WriteAllBytes(filePath, bytes);
    }
}
