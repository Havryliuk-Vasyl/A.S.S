using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
    public class AudioService : IAudioService
    {
        private readonly ApplicationDbContext _context;

        public AudioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<FileStream>> GetAudioAsync(string id)
        {
            ApiResponse<FileStream> response = new ApiResponse<FileStream>();
            string audioPath = GetAudioPath(id);

            if (string.IsNullOrEmpty(audioPath) || !System.IO.File.Exists(audioPath))
            {
                response.Message = "Audio file not found.";
                return response;
            }

            try
            {
                response.Data = new FileStream(audioPath, FileMode.Open, FileAccess.Read);
                response.Success = true;
                response.Message = "OK";
            }
            catch (Exception ex)
            {
                response.Message = $"Error opening audio file: {ex.Message}";
            }

            return response;
        }
        private string GetAudioPath(string id)
        {
            try
            {
                var audio = _context.Audios.FirstOrDefault(s => s.Song == Convert.ToInt32(id));
                return audio.FilePath;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Помилка при читанні аудіофайлу: {ex.Message}");
                return null;
            }
        }
    }
}
