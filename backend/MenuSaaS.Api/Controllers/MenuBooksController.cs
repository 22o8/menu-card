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
        return book is null ? NotFound(new { message = "Menu book not found." }) : Ok(book);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateMenuBookRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var book = service.Create(request);
            return CreatedAtAction(nameof(GetBySlug), new { slug = book.Slug }, book);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, [FromBody] UpdateMenuBookRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var book = service.Update(id, request);
            return book is null ? NotFound(new { message = "Menu book not found." }) : Ok(book);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/publish")]
    public IActionResult Publish(Guid id)
    {
        var book = service.SetPublication(id, publish: true);
        return book is null ? NotFound(new { message = "Menu book not found." }) : Ok(book);
    }

    [HttpPatch("{id:guid}/unpublish")]
    public IActionResult Unpublish(Guid id)
    {
        var book = service.SetPublication(id, publish: false);
        return book is null ? NotFound(new { message = "Menu book not found." }) : Ok(book);
    }
}
