using NAudio.Wave;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AudioController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private const string id = "{id}";

        public AudioController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("{id}")]
        public IActionResult GetAudio(string id)
        {
            var audioBytes = GetAudioBytesById(id);

            if (audioBytes == null)
            {
                return NotFound();
            }

            return new FileContentResult(audioBytes, "audio/mp3");
        }
        private byte[] GetAudioBytesById(string id)
        {
            var audio = context.Audios.FirstOrDefault(s => s.Id == Convert.ToInt32(id));
            if (audio == null)
            {
                return null;
            }

            try
            {
                return System.IO.File.ReadAllBytes(audio.FilePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Помилка при читанні аудіофайлу: {ex.Message}");
                return null;
            }
        }
    }
}
