using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserPhoto> UsersPhoto { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Audio> Audios { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Video> Videos { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
