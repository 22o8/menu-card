using MenuSaaS.Api.Data;
using MenuSaaS.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<DemoStore>();
builder.Services.AddSingleton<IAdminGuard, AdminGuard>();
builder.Services.AddScoped<IMenuBookService, MenuBookService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("open", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Ensure upload directories exist
var webRoot = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(Path.Combine(webRoot, "uploads", "menubooks"));

// Middleware
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("open");

app.UseStaticFiles();

app.MapControllers();

app.Run();