using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SongController : Controller
    {
        private readonly string _audioFilePath = "./media-files/audio";
        private readonly string _photoFilePath = "./media-files/photos";
        private readonly ISongService songService;
        private readonly ApplicationDbContext context;
        public SongController(ISongService songService, ApplicationDbContext context)
        {
            this.songService = songService;
            this.context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAudioById(int id)
        {
            var response = await songService.GetAudioById(id);
            return response.Success ? Ok(response) : NotFound();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllSongs()
        {
            var response = await songService.GetAllSongs();
            return response.Success ? Ok(response) :NotFound();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetSongsByUserId(int userId)
        {
            var response = await songService.GetSongsByUserId(userId);
            return response.Success ? Ok(response) : NotFound();
        }

        [HttpGet("photo/{id}")]
        public async Task<IActionResult> GetSongPhoto(int id)
        {
            ApiResponse<FileStream> response = await songService.GetSongPhoto(id);
            return response.Success ? File(response.Data, "image/jpg") : NotFound();
        }

        [HttpGet("photo/songId/{id}")]
        public async Task<IActionResult> GetSongPhotoBySong(int id)
        {
            ApiResponse<FileStream> response = await songService.GetSongPhotoBySong(id);
            return response.Success ? File(response.Data, "image/jpg") : NotFound();
        }
    }
}
