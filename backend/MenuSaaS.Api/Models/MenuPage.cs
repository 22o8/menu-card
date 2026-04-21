
using System.Text.Json.Serialization;

namespace MenuSaaS.Api.Models;

public class MenuPage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int Order { get; set; }
    public string ImageMimeType { get; set; } = "image/jpeg";
    [JsonIgnore]
    public string? ImageData { get; set; }
}
