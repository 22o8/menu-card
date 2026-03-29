namespace MenuSaaS.Api.DTOs;

public class CreateMenuBookRequest
{
    public string RestaurantName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ThemeId { get; set; } = "theme-1";
}
