
using Backend.Repositories;

namespace Backend.Services
{
    public class FileService : IFileService
    {
        private readonly IAudioFileRepository audioFileRepository;
        public FileService() { 
            audioFileRepository = new AudioFileRepository();
        }
        public void Save(IFormFile file, string name)
        {
            audioFileRepository.Save(file, name);
        }
        public void Delete(string file)
        {
            throw new NotImplementedException();
        }
    }
}
