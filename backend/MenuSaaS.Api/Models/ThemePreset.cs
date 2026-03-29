namespace MenuSaaS.Api.Models;

public class ThemePreset
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Preset { get; set; } = string.Empty;
    public string Background { get; set; } = string.Empty;
    public string PageTexture { get; set; } = string.Empty;
    public string Accent { get; set; } = string.Empty;
    public double ShadowStrength { get; set; }
}
