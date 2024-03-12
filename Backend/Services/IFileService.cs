namespace Backend.Services
{
    public interface IFileService
    {
        void Save(IFormFile file, string name);
        void Delete(string file);
    }
}
