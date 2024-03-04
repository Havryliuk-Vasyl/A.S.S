using Backend.Models;

namespace Backend.Repositories
{
    public interface IAudioFileRepository
    {
        void Save(IFormFile file, Media media);
        void Delete(string fileName);
    }
}
