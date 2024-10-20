public class AudioUploadModel
{
    public int ArtistId { get; set; }
    public string AlbumTitle { get; set; }
    public List<IFormFile> AudioFiles { get; set; }
    public IFormFile PhotoFile { get; set; }
    public List<string> SongTitles { get; set; }
    public List<int> GenreIds { get; set; }
}
