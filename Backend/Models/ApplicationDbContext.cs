using Microsoft.EntityFrameworkCore;

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
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistSong> PlaylistSongs { get; set; }
        public DbSet<PlaylistPhoto> PlaylistPhotos { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<AlbumSongs> AlbumSongs { get; set; }
        public DbSet<AlbumPhoto> AlbumPhotos { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<PlaylistSong>()
                .HasKey(ps => new { ps.PlaylistId, ps.SongId });

            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Playlist)
                .WithMany(p => p.PlaylistSongs)
                .HasForeignKey(ps => ps.PlaylistId);

            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Song)
                .WithMany()
                .HasForeignKey(ps => ps.SongId);

            modelBuilder.Entity<AlbumSongs>()
            .HasKey(als => new { als.AlbumId, als.SongId });

            modelBuilder.Entity<AlbumSongs>()
                .HasOne(als => als.Album)
                .WithMany(a => a.AlbumSongs)
                .HasForeignKey(als => als.AlbumId);

            modelBuilder.Entity<AlbumSongs>()
                .HasOne(als => als.Song)
                .WithMany()
                .HasForeignKey(als => als.SongId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
