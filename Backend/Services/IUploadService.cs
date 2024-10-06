using Backend.Models;

namespace Backend.Services
{
    public interface IUploadService
    {
        Task<ApiResponse<object>> Upload(AudioUploadModel audioUploadModel);
    }
}
