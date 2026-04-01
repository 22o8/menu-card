using MenuSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MenuSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController(IMenuBookService service) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(service.GetAssets());
}
