using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;

        public AlbumController(IAlbumService albumService)
        {
            _albumService = albumService;
        }

        [HttpGet("artist/{artistId}")]
        public async Task<IActionResult> GetAlbumsByArtist(int artistId)
        {
            var response = await _albumService.GetAlbumsByArtist(artistId);
            if (response.Success)
            {
                return Ok(response);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpGet("album/{albumId}")]
        public async Task<IActionResult> GetAlbumByAlbumId(int albumId)
        {
            var response = await _albumService.GetAlbumByAlbumId(albumId);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpGet("photo/{albumId}")]
        public async Task<IActionResult> GetAlbumPhoto(int albumId)
        {
            var response = await _albumService.GetPhoto(albumId);
            if (response.Success)
            {
                return File(response.Data, "image/jpeg");
            }
            return NotFound(response);
        }

        [HttpDelete("{albumId}")]
        public async Task<IActionResult> DeleteAlbum(int albumId)
        {
            var response = await _albumService.DeleteAlbum(albumId);
            if (response.Success)
            {
                return NoContent();
            }
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPost("photo/{albumId}")]
        public async Task<IActionResult> SetAlbumPhoto(IFormFile photoFile, int albumId)
        {
            var response = await _albumService.SetAlbumPhoto(photoFile, albumId);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpDelete("song/{albumId}/{songId}")]
        public async Task<IActionResult> DeleteSongFromAlbum(int albumId, int songId)
        {
            var response = await _albumService.DeleteSongFromAlbum(albumId, songId);
            if (response.Success)
            {
                return NoContent();
            }
            return BadRequest(response);
        }

        [HttpPut("{albumId}")]
        public async Task<IActionResult> EditAlbum(int albumId, [FromBody] string newAlbumName)
        {
            var response = await _albumService.EditAlbum(albumId, newAlbumName);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpGet("song/{songId}")]
        public async Task<IActionResult> GetAlbumBySongId(int songId)
        {
            var response = await _albumService.GetAlbumBySongId(songId);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
    }
}
