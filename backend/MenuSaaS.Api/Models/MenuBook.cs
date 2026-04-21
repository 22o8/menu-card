namespace MenuSaaS.Api.Models;

public class MenuBook
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string RestaurantName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public string ThemeId { get; set; } = "theme-1";
    public string Status { get; set; } = "draft";
    public int Views { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public List<MenuPage> Pages { get; set; } = [];
}
