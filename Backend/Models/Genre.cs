using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("genres")]
    public class Genre
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        public ICollection<AlbumGenre> AlbumGenres { get; set; }

        public Genre()
        {
            AlbumGenres = new List<AlbumGenre>();
        }
    }
}
