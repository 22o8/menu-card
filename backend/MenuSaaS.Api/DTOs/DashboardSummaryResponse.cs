namespace MenuSaaS.Api.DTOs;

public class DashboardSummaryResponse
{
    public int TotalBooks { get; set; }
    public int PublishedBooks { get; set; }
    public int DraftBooks { get; set; }
    public int TotalPages { get; set; }
    public int TotalViews { get; set; }
    public int TotalThemes { get; set; }
    public int TotalAssets { get; set; }
}
