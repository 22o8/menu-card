namespace MenuSaaS.Api.Services;

public class AdminGuard(IConfiguration configuration) : IAdminGuard
{
    public string CurrentKey => configuration["Admin:Key"] ?? Environment.GetEnvironmentVariable("MENU_ADMIN_KEY") ?? "menu-admin-2026";

    public bool IsValid(HttpRequest request)
    {
        if (!request.Headers.TryGetValue("x-admin-key", out var headerValue))
        {
            return false;
        }

        return string.Equals(headerValue.ToString(), CurrentKey, StringComparison.Ordinal);
    }
}
