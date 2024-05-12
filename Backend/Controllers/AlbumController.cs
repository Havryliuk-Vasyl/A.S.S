using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public AlbumController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("artist/{artistId}")]
        public async Task<IActionResult> GetAlbumsByArtist(int artistId)
        {
            try
            {
                var albums = await context.Albums
                    .Where(a => a.User == artistId)
                    .ToListAsync();

                return Ok(albums);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("photo/{albumId}")]
        public async Task<IActionResult> GetSongPhoto(int albumId)
        {
            var photo = await context.AlbumPhotos.FirstOrDefaultAsync(a => a.Album == albumId);
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
