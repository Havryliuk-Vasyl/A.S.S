using Google.Protobuf.WellKnownTypes;

namespace Backend.Models
{
    public class Video
    {
        private int id;
        private string url;
        private float duration;
        private int frameRate;
        public Video(int id, string url, float duration, int frameRate)
        {
            this.id = id;
            this.url = url;
            this.duration = duration;
            this.frameRate = frameRate;
        }
    }
}
