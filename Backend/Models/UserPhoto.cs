using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("user_photos")]
    public class UserPhoto
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("user")]
        public int User { get; set; }
        [Column("file_path")]
        public string FilePath { get; set; }
        public UserPhoto() { }
        public UserPhoto(int id, int user, string filePath)
        {
            Id = id;
            User = user;
            FilePath = filePath;
        }
    }
}
