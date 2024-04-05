namespace Backend.Models
{
    public class Audio
    {
        public int Id { get; set; }
        public int SongId { get; set; }
        public float Duration { get; set; }
        public string FilePath { get; set; }

        public Audio(int id, int songId, float duration, string filePath)
        {
            this.Id = id;
            this.SongId = songId;
            this.Duration = duration;
            this.FilePath = filePath;
        }
    }
}
