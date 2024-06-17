namespace Backend.Models
{
    public class AudioUploadModel
    {
        public int ArtistId { get; set; }
        public string AlbumTitle { get; set; }
        public List<IFormFile> AudioFiles { get; set; }
        public List<string> SongTitles { get; set; }
        public IFormFile PhotoFile { get; set; }
        public AudioUploadModel()
        {
            AudioFiles = new List<IFormFile>();
            SongTitles = new List<string>();
        }
        public AudioUploadModel(int artistId, string title, string albumTitle, List<IFormFile> audioFiles, List<string> songTitles, IFormFile photoFile)
        {
            ArtistId = artistId;
            AlbumTitle = albumTitle;
            AudioFiles = audioFiles;
            SongTitles = songTitles;
            PhotoFile = photoFile;
        }
    }
}
