using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Backend.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public ApplicationDbContext() { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("_user");   
            modelBuilder.Entity<User>()
                .HasKey(u => u.id);
        }
    }
}
