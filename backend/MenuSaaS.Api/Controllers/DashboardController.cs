using MenuSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MenuSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IMenuBookService service) : ControllerBase
{
    [HttpGet("summary")]
    public IActionResult Summary() => Ok(service.GetDashboardSummary());
}
