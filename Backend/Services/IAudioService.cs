using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
    public interface IAudioService
    {
        Task<ApiResponse<FileStream>> GetAudioAsync(string id);
    }
}
