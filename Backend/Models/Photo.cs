using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("photos")]
    public class Photo
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("song")]
        public int SongId { get; set; }

        [Column("dimension_x")]
        public int DimensionX { get; set; }
        [Column("dimension_y")]
        public int DimensionY { get; set; }
        [Column("file_path")]
        public string FilePath { get; set; }

        public Photo() { }
        public Photo(int songId, string filePath)
        {
            SongId = songId;
            FilePath = filePath;
        }
        public Photo(int id, int songId, int dimensionX, int dimensionY, string filePath)
        {
            Id = id;
            SongId = songId;
            DimensionX = dimensionX;
            DimensionY = dimensionY;
            FilePath = filePath;
        }
    }
}
