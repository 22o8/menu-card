using System.Text.Json;
using MenuSaaS.Api.Data;
using MenuSaaS.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
        new BadRequestObjectResult(new
        {
            message = "Validation failed.",
            errors = context.ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    x => x.Key,
                    x => x.Value!.Errors.Select(e => e.ErrorMessage).ToArray())
        });
});

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

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        if (allowedOrigins.Length == 0 || allowedOrigins.Contains("*"))
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
            return;
        }

        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("frontend");

app.MapGet("/", () => Results.Ok(new
{
    ok = true,
    service = "MenuSaaS API",
    version = "v1",
    environment = app.Environment.EnvironmentName,
    timeUtc = DateTime.UtcNow
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    uptime = Environment.TickCount64
}));

app.MapControllers();

app.Run();
