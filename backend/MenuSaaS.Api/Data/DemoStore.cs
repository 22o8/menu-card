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
            Description = "المنيو الرئيسي",
            CoverImageUrl = "/demo/cover.jpg",
            ThemeId = "theme-1",
            Status = "published",
            Views = 1248,
            Pages =
            [
                new MenuPage { Title = "Cover", ImageUrl = "/demo/cover.jpg", Order = 1 },
                new MenuPage { Title = "Breakfast", ImageUrl = "/demo/page-1.jpg", Order = 2 },
                new MenuPage { Title = "Main Dishes", ImageUrl = "/demo/page-2.jpg", Order = 3 },
                new MenuPage { Title = "Desserts", ImageUrl = "/demo/page-3.jpg", Order = 4 }
            ]
        }
    ];

    public List<ThemePreset> Themes { get; } =
    [
        new ThemePreset { Id = "theme-1", Name = "Classic Luxury", Preset = "classic-luxury", Background = "dark", PageTexture = "/demo/paper-light.jpg", Accent = "#d6b36a", ShadowStrength = 0.65 },
        new ThemePreset { Id = "theme-2", Name = "Clean Modern", Preset = "clean-modern", Background = "light", PageTexture = "/demo/paper-white.jpg", Accent = "#202020", ShadowStrength = 0.35 },
        new ThemePreset { Id = "theme-3", Name = "Dark Elegant", Preset = "dark-elegant", Background = "dark", PageTexture = "/demo/paper-dark.jpg", Accent = "#f1e1b0", ShadowStrength = 0.75 },
        new ThemePreset { Id = "theme-4", Name = "Arabic Premium", Preset = "arabic-premium", Background = "green", PageTexture = "/demo/paper-cream.jpg", Accent = "#f0d28c", ShadowStrength = 0.60 }
    ];
}
