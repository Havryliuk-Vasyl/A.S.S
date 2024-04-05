namespace Backend.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public int SongId { get; set; }
        public int DimensionX { get; set; }
        public int DimensionY { get; set; }
        public string FilePath { get; set; }

        public Photo(int id, int songId, int dimensionX, int dimensionY, string filePath)
        {
            Id = id;
            SongId = songId;
            DimensionX = dimensionX;
            DimensionY = dimensionY;
            FilePath = filePath;
        }
    }
}
