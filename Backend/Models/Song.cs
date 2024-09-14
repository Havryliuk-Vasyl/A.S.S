using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("songs")]
    public class Song
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("title")]
        public string Title { get; set; }
        [Column("artist")]
        public int Artist { get; set; }
        [Column("type")]
        public string Type { get; set; }
        [Column("albumTitle")]
        public string AlbumTitle { get; set; }
        [Column("date_shared")]
        public DateOnly DateShared { get; set; }
        public ICollection<Audio> Audios { get; set; }
        public Song()
        {
            Audios = new List<Audio>();
        }

        public Song(int id, string title, int artist, string albumTitle, DateOnly date_shared)
        {
            this.Id = id;
            this.Title = title;
            this.Artist = artist;
            this.AlbumTitle = albumTitle;
            this.DateShared = date_shared;
            Audios = new List<Audio>();
        }
        public Song(string title, int artist, string albumTitle, DateOnly date_shared)
        {
            this.Title = title;
            this.Artist = artist;
            this.AlbumTitle = albumTitle;
            this.DateShared = date_shared;
            Audios = new List<Audio>();
        }
    }
}
