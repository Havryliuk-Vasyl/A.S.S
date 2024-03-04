using Microsoft.Identity.Client;

namespace Backend.Models
{
    public class MediaContent
    {
        private int id { get; set; }
        private string title { get; set; }
        private string author { get; set; }
        private string albumTitle { get; set; }
        private List<string> genre { get; set; }
        private Audio audio { get; set; }
        private Video video { get; set; }
        private Image image { get; set; }

        public MediaContent(int id, string title, string author, string albumTitle, List<string> genre, Audio audio, Video video, Image image)
        {
            this.id = id;
            this.title = title;
            this.author = author;
            this.albumTitle = albumTitle;
            this.genre = genre;
            this.audio = audio;
            this.video = video;
            this.image = image;
        }
    }
}
