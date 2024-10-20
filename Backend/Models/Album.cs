using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("album")]
    public class Album
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("user")]
        public int User { get; set; }
        [Column("title")]
        public string Title { get; set; }
        [Column("date_shared")]
        public DateOnly DateShared { get; set; }
        public ICollection<AlbumSongs> AlbumSongs { get; set; }
        public ICollection<AlbumGenre> AlbumGenres { get; set; }
        public Album()
        {
            AlbumSongs = new List<AlbumSongs>();
            AlbumGenres = new List<AlbumGenre>();
        }
    }

    [Table("album_songs")]
    public class AlbumSongs
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("album")]
        public int AlbumId { get; set; }
        [Column("song")]
        public int SongId { get; set; }
        public Album Album { get; set; }
        public Song Song { get; set; }
    }

    [Table("album_photos")]
    public class AlbumPhoto
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("album")]
        public int Album { get; set; }
        [Column("file_path")]
        public string FilePath { get; set; }

        public AlbumPhoto()
        {

        }

        public AlbumPhoto(int id, int album, string file_path)
        {
            this.Id = id;
            this.Album = album;
            this.FilePath = file_path;
        }
    }
}
