namespace Backend.Models
{
    public class MediaContent
    {
        private int id;
        private string title;
        private string artist;
        private string albumTitle;
        private string[] ganre;
        private Audio audio;
        private Image image;
        private Video video;
        public MediaContent(int id, string title, string artist, string albumTitle, string[] ganre, Audio audio, Image image, Video video)
        {
            this.id = id;
            this.title = title;
            this.artist = artist;
            this.albumTitle = albumTitle;
            this.ganre = ganre;
            this.audio = audio;
            this.image = image;
            this.video = video;
        }
    }
}
