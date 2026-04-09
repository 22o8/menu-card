namespace MenuSaaS.Api.DTOs;

public class AddPagesRequest
{
    public List<CreateMenuPageRequest> Pages { get; set; } = [];
}
