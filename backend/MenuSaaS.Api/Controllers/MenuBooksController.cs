using MenuSaaS.Api.DTOs;
using MenuSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MenuSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuBooksController(IMenuBookService service, IAdminGuard adminGuard) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(service.GetBooks());

    [HttpGet("{slug}")]
    public IActionResult GetBySlug(string slug)
    {
        var book = service.GetBySlug(slug);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpGet("id/{id:guid}")]
    public IActionResult GetById(Guid id)
    {
        var book = service.GetById(id);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateMenuBookRequest request)
    {
        if (!adminGuard.IsValid(Request)) return Unauthorized("مفتاح الأدمن غير صحيح.");

        try
        {
            var book = service.Create(request);
            return CreatedAtAction(nameof(GetBySlug), new { slug = book.Slug }, book);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, [FromBody] UpdateMenuBookRequest request)
    {
        if (!adminGuard.IsValid(Request)) return Unauthorized("مفتاح الأدمن غير صحيح.");

        try
        {
            return Ok(service.Update(id, request));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id:guid}/pages")]
    public IActionResult AddPages(Guid id, [FromBody] AddPagesRequest request)
    {
        if (!adminGuard.IsValid(Request)) return Unauthorized("مفتاح الأدمن غير صحيح.");

        try
        {
            return Ok(service.AddPages(id, request));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        if (!adminGuard.IsValid(Request)) return Unauthorized("مفتاح الأدمن غير صحيح.");
        service.Delete(id);
        return NoContent();
    }

    [HttpDelete("{bookId:guid}/pages/{pageId:guid}")]
    public IActionResult DeletePage(Guid bookId, Guid pageId)
    {
        if (!adminGuard.IsValid(Request)) return Unauthorized("مفتاح الأدمن غير صحيح.");

        try
        {
            service.DeletePage(bookId, pageId);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
