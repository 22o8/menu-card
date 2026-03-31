using MenuSaaS.Api.Data;
using MenuSaaS.Api.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MenuSaaS API",
        Version = "v1",
        Description = "Menu Book SaaS API"
    });
});

builder.Services.AddSingleton<DemoStore>();
builder.Services.AddScoped<IMenuBookService, MenuBookService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("open", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("open");

app.MapGet("/", () => Results.Ok(new
{
    ok = true,
    service = "MenuSaaS API",
    timeUtc = DateTime.UtcNow
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy"
}));

app.MapControllers();

app.Run();