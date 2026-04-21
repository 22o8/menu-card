namespace MenuSaaS.Api.Services;

public interface IAdminGuard
{
    bool IsValid(HttpRequest request);
    string CurrentKey { get; }
}
