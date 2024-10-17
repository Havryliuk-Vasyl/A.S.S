using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("playlists")]
    public class Playlist
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("user")]
        public int User { get; set; }
        [Column("title")]
        public string Title { get; set; }
        public ICollection<PlaylistSong> PlaylistSongs { get; set; }
    }

    public class CreatePlaylistRequest
    {
        public string Title { get; set; }
        public int UserId { get; set; }

        public CreatePlaylistRequest() { }
    }

    [Table("playlist_songs")]
    public class PlaylistSong
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("playlist")]
        public int PlaylistId { get; set; }
        [Column("song")]
        public int SongId { get; set; }
        public Playlist Playlist { get; set; }
        public Song Song { get; set; }
    }

    [Table("playlist_photos")]
    public class PlaylistPhoto
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("playlist")]
        public int Playlist { get; set; }
        [Column("file_path")]
        public string FilePath { get; set; }
        public PlaylistPhoto() { }

        public PlaylistPhoto(int playlist, string filePath)
        {
            this.Playlist = playlist;
            this.FilePath = filePath;
        }
    }
}
