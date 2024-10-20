using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("album_genres")]
    public class AlbumGenre
    {
        [Column("album_id")]
        public int AlbumId { get; set; }
        public Album Album { get; set; }

        [Column("genre_id")]
        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}
