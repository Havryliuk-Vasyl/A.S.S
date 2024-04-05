namespace Backend.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int ArtistId { get; set; }
        public string AlbumTitle { get; set; }
        public DateOnly DateShared { get; set; }

        public Song(int id, string title, int artistId, string albumTitle, DateOnly dateShared)
        {
            Id = id;
            Title = title;
            ArtistId = artistId;
            AlbumTitle = albumTitle;
            DateShared = dateShared;
        }
    }
}
