using MenuSaaS.Api.Data;
using MenuSaaS.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddSingleton<DemoStore>();
builder.Services.AddScoped<IMenuBookService, MenuBookService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("open", policy => policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("open");
app.MapControllers();
app.Run();
