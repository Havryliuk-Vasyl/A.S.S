using Backend.Models;
using System.Drawing.Drawing2D;

namespace Backend.Repositories
{
    public class AudioFileRepository : IAudioFileRepository
    {
        private readonly string _filePath;
        public AudioFileRepository()
        {
            _filePath = "media-files/audio";
        }
        public void Save(IFormFile file, string name)
        {
            var filePath = Path.Combine(_filePath, name);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }
        }
        public void Delete(string fileName)
        {
            var filePath = Path.Combine(_filePath, fileName);
         
            try
            {
                File.Delete(filePath);
            }
            catch {
                throw new Exception();
            }
        }
    }
}
