using MenuSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MenuSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThemesController(IMenuBookService service) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(service.GetThemes());
}
