using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AudioController : ControllerBase
    {
        private readonly IAudioService audioService;
        private const string id = "{id}";

        public AudioController(IAudioService audioService)
        {
            this.audioService = audioService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAudioAsync(string id)
        {
            ApiResponse<FileStream> response = await audioService.GetAudioAsync(id);
            return response.Success ? File(response.Data, "audio/*") : BadRequest();
        }
    }
}
