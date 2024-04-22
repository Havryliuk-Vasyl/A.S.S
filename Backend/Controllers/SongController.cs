using Backend.Models;
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
        private readonly ApplicationDbContext context;

        public SongController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("id")]
        public async Task<ActionResult<object>> GetAudioById(int id)
        {
            var song = await context.Songs.FirstOrDefaultAsync(s => s.Id == id);

            if (song == null)
            {
                return NotFound();
            }

            var artist = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
            if (artist == null)
            {
                return NotFound();
            }

            var result = new
            {
                song,
                ArtistId = song.Artist,
                ArtistName = artist.Username
            };

            return result;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllSongs()
        {
            var songs = await context.Songs.ToListAsync();
            if (songs == null || songs.Count == 0)
            {
                return NotFound();
            }

            var response = new List<object>();
            foreach (var song in songs)
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.Id == song.Artist);
                var audio = await context.Audios.FirstOrDefaultAsync(a => a.Song == song.Id);
                var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == song.Id);
                if (user != null && audio != null && photo != null)
                {
                    response.Add(new
                    {
                        song,
                        artist = user.Username,
                        duration = audio.Duration,
                        photo
                    });
                }
            }

            return response;
        }


        [HttpGet("photo/{id}")]
        public async Task<IActionResult> GetSongPhoto(int id)
        {
            var photo = await context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            if (photo == null)
            {
                return NotFound();
            }

            if (!System.IO.File.Exists(photo.FilePath))
            {
                return NotFound();
            }

            byte[] photoBytes = System.IO.File.ReadAllBytes(photo.FilePath);

            return File(photoBytes, "image/jpeg");
        }
    }
}
