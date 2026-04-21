namespace MenuSaaS.Api.DTOs;

public class UpdateMenuBookRequest
{
    public string RestaurantName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ThemeId { get; set; } = "theme-1";
    public bool Publish { get; set; }
}
