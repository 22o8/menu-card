using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MenuSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuBooksController(IMenuBookService service) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(service.GetBooks());

    [HttpGet("{slug}")]
    public IActionResult GetBySlug(string slug)
    {
        var book = service.GetBySlug(slug);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateMenuBookRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Slug))
            return BadRequest("Title and Slug are required.");

        var book = service.Create(request);
        return CreatedAtAction(nameof(GetBySlug), new { slug = book.Slug }, book);
    }
}
