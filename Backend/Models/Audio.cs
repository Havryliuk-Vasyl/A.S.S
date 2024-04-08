using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("audios")]
    public class Audio
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("song")]
        public int Song { get; set; }
        [Column("duration")]
        public float Duration { get; set; }
        [Column("file_path")]
        public string FilePath { get; set; }

        public Audio() { }
        public Audio(int id, int song, float duration, string filePath)
        {
            this.Id = id;
            this.Song = song;
            this.Duration = duration;
            this.FilePath = filePath;
        }

        public Audio(int song, float duration, string filePath)
        {
            this.Song = song;
            this.Duration = duration;
            this.FilePath = filePath;
        }
    }
}
