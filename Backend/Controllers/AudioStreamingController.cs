using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioStreamingController : ControllerBase
    {
        private readonly IAudioStreamingService audioStreamingService;
        public AudioStreamingController() {
            audioStreamingService = new AudioStreamingService();
        }

        [HttpGet("audio/{id}")]
        public IActionResult Get(int id)
        {
            MediaService mediaService = new MediaService();

            byte[] audioBytes = audioStreamingService.GetAudioFile(mediaService.GetMediaById(id));

            if (audioBytes != null)
            {
                var stream = new MemoryStream(audioBytes);
                return File(stream, "audio/wav");
            }
            return BadRequest();
        }
    }
}
