using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Data;
using ShowMeTheMenu.Api.Endpoints;
using ShowMeTheMenu.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IWeeklyMenuService, WeeklyMenuService>();
builder.Services.AddSingleton<IAiSuggestionService, AiSuggestionService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Auto-apply migrations in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.MapGet("/api/health", () => Results.Ok(new { status = "healthy" }))
.WithName("HealthCheck")
.WithOpenApi();

app.MapRecipeEndpoints();
app.MapWeeklyMenuEndpoints();
app.MapAiEndpoints();

app.Run();
