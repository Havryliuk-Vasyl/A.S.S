using Google.Protobuf.WellKnownTypes;

namespace Backend.Models
{
    public class Video
    {
        public int Id { get; set; }
        public int SongId { get; set; }
        public float Duration { get; set; }
        public int FrameRate { get; set; }
        public string FilePath { get; set; }

        public Video(int id, int songId, float duration, int frameRate, string filePath) {
            Id = id;
            SongId = songId;
            Duration = duration;
            FrameRate = frameRate;
            FilePath = filePath;
        }
    }
}
