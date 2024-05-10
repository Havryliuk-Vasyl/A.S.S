using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

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
}
