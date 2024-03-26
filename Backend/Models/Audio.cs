namespace Backend.Models
{
    public class Audio
    {
        private int id;
        private string url;
        private float duration;
        private float frequency;

        public Audio(int id, string url, float duration, float frequency)
        {
            this.id = id;
            this.url = url;
            this.duration = duration;
            this.frequency = frequency;
        }
    }
}
