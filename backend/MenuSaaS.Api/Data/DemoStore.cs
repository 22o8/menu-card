using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Data;

public class DemoStore
{
    public List<MenuBook> Books { get; } =
    [
        new MenuBook
        {
            RestaurantName = "Blossom House",
            Title = "Main Menu 2026",
            Slug = "blossom-house-main-menu",
            Description = "منيو المطعم الرئيسي المصمم بأسلوب فاخر ومرتب للعرض على الهاتف والويب.",
            CoverImageUrl = "/demo/cover.jpg",
            ThemeId = "theme-1",
            Status = "published",
            Views = 1248,
            UpdatedAtUtc = DateTime.UtcNow.AddHours(-5),
            Pages =
            [
                new MenuPage { Title = "Cover", ImageUrl = "/demo/cover.jpg", Order = 1 },
                new MenuPage { Title = "Breakfast", ImageUrl = "/demo/page-1.jpg", Order = 2 },
                new MenuPage { Title = "Main Dishes", ImageUrl = "/demo/page-2.jpg", Order = 3 },
                new MenuPage { Title = "Desserts", ImageUrl = "/demo/page-3.jpg", Order = 4 }
            ]
        },
        new MenuBook
        {
            RestaurantName = "Blossom House",
            Title = "Dessert Book",
            Slug = "blossom-house-dessert-book",
            Description = "منيو الحلويات والمشروبات الباردة.",
            CoverImageUrl = "/demo/cover-2.jpg",
            ThemeId = "theme-4",
            Status = "draft",
            Views = 87,
            UpdatedAtUtc = DateTime.UtcNow.AddDays(-1),
            Pages =
            [
                new MenuPage { Title = "Cover", ImageUrl = "/demo/cover-2.jpg", Order = 1 },
                new MenuPage { Title = "Desserts", ImageUrl = "/demo/page-3.jpg", Order = 2 },
                new MenuPage { Title = "Coffee", ImageUrl = "/demo/page-1.jpg", Order = 3 }
            ]
        }
    ];

    public List<ThemePreset> Themes { get; } =
    [
        new ThemePreset
        {
            Id = "theme-1",
            Name = "Classic Luxury",
            Preset = "classic-luxury",
            Background = "radial-gradient(circle at top, #3b2b17 0%, #120d08 55%, #060505 100%)",
            PageTexture = "/demo/paper-light.jpg",
            Accent = "#d6b36a",
            ShadowStrength = 0.65
        },
        new ThemePreset
        {
            Id = "theme-2",
            Name = "Clean Modern",
            Preset = "clean-modern",
            Background = "linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)",
            PageTexture = "/demo/paper-white.jpg",
            Accent = "#202020",
            ShadowStrength = 0.35
        },
        new ThemePreset
        {
            Id = "theme-3",
            Name = "Dark Elegant",
            Preset = "dark-elegant",
            Background = "radial-gradient(circle at center, #242424 0%, #101010 70%, #000000 100%)",
            PageTexture = "/demo/paper-dark.jpg",
            Accent = "#f1e1b0",
            ShadowStrength = 0.75
        },
        new ThemePreset
        {
            Id = "theme-4",
            Name = "Arabic Premium",
            Preset = "arabic-premium",
            Background = "radial-gradient(circle at top, #18403b 0%, #0b1f1d 58%, #030808 100%)",
            PageTexture = "/demo/paper-cream.jpg",
            Accent = "#f0d28c",
            ShadowStrength = 0.60
        }
    ];

    public List<AssetItem> Assets { get; } =
    [
        new AssetItem { Name = "cover.jpg", Type = "Image", Url = "/demo/cover.jpg", SizeInBytes = 324_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-4) },
        new AssetItem { Name = "cover-2.jpg", Type = "Image", Url = "/demo/cover-2.jpg", SizeInBytes = 288_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-3) },
        new AssetItem { Name = "page-1.jpg", Type = "Image", Url = "/demo/page-1.jpg", SizeInBytes = 415_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-3) },
        new AssetItem { Name = "page-2.jpg", Type = "Image", Url = "/demo/page-2.jpg", SizeInBytes = 398_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-2) },
        new AssetItem { Name = "page-3.jpg", Type = "Image", Url = "/demo/page-3.jpg", SizeInBytes = 356_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-2) },
        new AssetItem { Name = "paper-light.jpg", Type = "Texture", Url = "/demo/paper-light.jpg", SizeInBytes = 96_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-7) },
        new AssetItem { Name = "paper-dark.jpg", Type = "Texture", Url = "/demo/paper-dark.jpg", SizeInBytes = 112_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-7) },
        new AssetItem { Name = "menu.pdf", Type = "PDF", Url = "/demo/menu.pdf", SizeInBytes = 1_850_000, UploadedAtUtc = DateTime.UtcNow.AddDays(-1) }
    ];
}
