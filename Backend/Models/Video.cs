namespace Backend.Models
{
    public class Video
    {
        private int id { get; set; }
        private string url { get; set; }
        private float duration { get; set; }
        private int frameRate { get; set; }
        private Video(int id, string url, float duration, int frameRate)
        {
            this.id = id;
            this.url = url;
            this.duration = duration;
            this.frameRate = frameRate;
        }
    }
}
