using Microsoft.EntityFrameworkCore;

namespace OnboardFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<DbHealthCheck> HealthChecks => Set<DbHealthCheck>();
}

public class DbHealthCheck
{
    public int Id { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
