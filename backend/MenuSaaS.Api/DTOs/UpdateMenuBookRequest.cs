using System.ComponentModel.DataAnnotations;

namespace MenuSaaS.Api.DTOs;

public class UpdateMenuBookRequest
{
    [Required, MaxLength(120)]
    public string RestaurantName { get; set; } = string.Empty;

    [Required, MaxLength(160)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public string ThemeId { get; set; } = "theme-1";

    [Required]
    public string Status { get; set; } = "draft";
}
