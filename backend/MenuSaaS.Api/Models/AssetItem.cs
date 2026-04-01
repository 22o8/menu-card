namespace MenuSaaS.Api.Models;

public class AssetItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public long SizeInBytes { get; set; }
    public DateTime UploadedAtUtc { get; set; } = DateTime.UtcNow;
}
