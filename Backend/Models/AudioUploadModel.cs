using Microsoft.AspNetCore.Http.Metadata;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class AudioUploadModel
    {
        public int ArtistId { get; set; }
        public string Title { get; set; }
        public string AlbumTitle { get; set; }
        public IFormFile AudioFile { get; set; }
        public IFormFile PhotoFile { get; set; }
        
        public AudioUploadModel() { }
        public AudioUploadModel(int id, string title, string albumTitle, IFormFile audioFile, IFormFile photoFile)
        {
            ArtistId = id;
            Title = title;
            AlbumTitle = albumTitle;
            AudioFile = audioFile;
            PhotoFile = photoFile;
        }
    }
}
