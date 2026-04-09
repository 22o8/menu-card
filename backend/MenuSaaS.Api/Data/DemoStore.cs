
using System.Text.Json;
using MenuSaaS.Api.Models;

namespace MenuSaaS.Api.Data;

public class DemoStore
{
    private readonly IWebHostEnvironment _environment;
    private readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };
    private readonly object _sync = new();
    private readonly string _storeFilePath;

    public List<MenuBook> Books { get; private set; }
    public List<ThemePreset> Themes { get; private set; }

    public DemoStore(IWebHostEnvironment environment)
    {
        _environment = environment;
        var dataFolder = Path.Combine(_environment.ContentRootPath, "App_Data");
        Directory.CreateDirectory(dataFolder);
        _storeFilePath = Path.Combine(dataFolder, "store.json");

        Themes = CreateDefaultThemes();
        Books = CreateDefaultBooks();

        Load();
    }

    public void Save()
    {
        lock (_sync)
        {
            var payload = new StoreFile
            {
                Books = Books,
                Themes = Themes
            };
            var json = JsonSerializer.Serialize(payload, _jsonOptions);
            File.WriteAllText(_storeFilePath, json);
        }
    }

    private void Load()
    {
        if (!File.Exists(_storeFilePath))
        {
            Save();
            return;
        }

        try
        {
            var json = File.ReadAllText(_storeFilePath);
            var payload = JsonSerializer.Deserialize<StoreFile>(json, _jsonOptions);
            if (payload?.Books is { Count: > 0 }) Books = payload.Books;
            if (payload?.Themes is { Count: > 0 }) Themes = payload.Themes;
        }
        catch
        {
            Save();
        }
    }

    private static List<MenuBook> CreateDefaultBooks() =>
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
                new MenuPage { Title = "Cover", ImageUrl = "/demo/cover.jpg", Order = 1, ImageMimeType = "image/jpeg" },
                new MenuPage { Title = "Breakfast", ImageUrl = "/demo/page-1.jpg", Order = 2, ImageMimeType = "image/jpeg" },
                new MenuPage { Title = "Main Dishes", ImageUrl = "/demo/page-2.jpg", Order = 3, ImageMimeType = "image/jpeg" },
                new MenuPage { Title = "Desserts", ImageUrl = "/demo/page-3.jpg", Order = 4, ImageMimeType = "image/jpeg" }
            ]
        }
    ];

    private static List<ThemePreset> CreateDefaultThemes() =>
    [
        new ThemePreset { Id = "theme-1", Name = "Classic Luxury", Preset = "classic-luxury", Background = "dark", PageTexture = "/demo/paper-light.jpg", Accent = "#d6b36a", ShadowStrength = 0.65 },
        new ThemePreset { Id = "theme-2", Name = "Clean Modern", Preset = "clean-modern", Background = "light", PageTexture = "/demo/paper-white.jpg", Accent = "#202020", ShadowStrength = 0.35 },
        new ThemePreset { Id = "theme-3", Name = "Dark Elegant", Preset = "dark-elegant", Background = "dark-elegant", PageTexture = "/demo/paper-dark.jpg", Accent = "#f1e1b0", ShadowStrength = 0.75 },
        new ThemePreset { Id = "theme-4", Name = "Arabic Premium", Preset = "arabic-premium", Background = "green", PageTexture = "/demo/paper-cream.jpg", Accent = "#f0d28c", ShadowStrength = 0.60 }
    ];

    private sealed class StoreFile
    {
        public List<MenuBook> Books { get; set; } = [];
        public List<ThemePreset> Themes { get; set; } = [];
    }
}
