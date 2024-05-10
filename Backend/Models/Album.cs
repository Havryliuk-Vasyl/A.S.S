using System.Collections.Generic;
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
        public ICollection<AlbumSongs> AlbumSongs { get; set; }
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
}
