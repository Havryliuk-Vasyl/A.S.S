using Backend.Models;

namespace Backend.Repositories
{
    public interface IAudioFileRepository
    {
        void Save(IFormFile file, string name);
        void Delete(string fileName);
    }
}
