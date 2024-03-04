namespace Backend.Models
{
    public class Audio
    {
        private int id { get; set; }
        private string url { get; set; }
        private float duration { get; set; }
        private float frequency { get; set; }

        public Audio(int id, string url, float duration, float frequency)
        {
            this.id = id;
            this.url = url;
            this.duration = duration;
            this.frequency = frequency;
        }
    }
}
