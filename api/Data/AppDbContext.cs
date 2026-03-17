using Microsoft.EntityFrameworkCore;
using ShowMeTheMenu.Api.Models;

namespace ShowMeTheMenu.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<WeeklyMenu> WeeklyMenus => Set<WeeklyMenu>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<AppSettings> AppSettings => Set<AppSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppSettings>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).HasMaxLength(128).IsRequired();
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.Property(e => e.AnthropicApiKey).HasMaxLength(200);
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).HasMaxLength(128).IsRequired();
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Ingredients).IsRequired();
            entity.Property(e => e.Instructions).IsRequired();
            entity.Property(e => e.Tags).HasColumnType("text[]");
        });

        modelBuilder.Entity<WeeklyMenu>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).HasMaxLength(128).IsRequired();
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.HasMany(e => e.Items)
                  .WithOne(e => e.WeeklyMenu)
                  .HasForeignKey(e => e.WeeklyMenuId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DayOfWeek).IsRequired();
            entity.Property(e => e.MealType).IsRequired();
            entity.Property(e => e.CustomName).HasMaxLength(200);
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.HasOne(e => e.Recipe)
                  .WithMany(e => e.MenuItems)
                  .HasForeignKey(e => e.RecipeId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
