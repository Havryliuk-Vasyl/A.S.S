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
        private readonly IAlbumService albumService;

        public AlbumController(IAlbumService albumService)
        {
            this.albumService = albumService;
        }

        [HttpGet("artist/{artistId}")]
        public async Task<IActionResult> GetAlbumsByArtist(int artistId)
        {
            var response = await albumService.GetAlbumsByArtist(artistId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpGet("album/{albumId}")]
        public async Task<IActionResult> GetAlbumByAlbumId(int albumId)
        {
            var response = await albumService.GetAlbumByAlbumId(albumId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpGet("photo/{albumId}")]
        public async Task<IActionResult> GetAlbumPhoto(int albumId)
        {
            var response = await albumService.GetPhoto(albumId);
            return response.Success ? File(response.Data, "image/jpeg") : BadRequest();
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAlbum(int albumId)
        {
            var response = await albumService.DeleteAlbum(albumId);
            return response.Success ? Ok(response) : NoContent();
        }

        [HttpDelete("song/{albumId}/{songId}")]
        public async Task<IActionResult> DeleteSongFromAlbum(int albumId, int songId)
        {
            var response = await albumService.DeleteSongFromAlbum(albumId, songId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditAlbum(int albumId, [FromBody] string newAlbumName)
        {
            var response = await albumService.EditAlbum(albumId, newAlbumName);
            return response.Success ? Ok(response) : NotFound();
        }

        [HttpGet("song/{songId}")]
        public async Task<IActionResult> GetAlbumBySongId(int songId)
        {
            var response = await albumService.GetAlbumBySongId(songId);
            return response.Success ? Ok(response) : NotFound();
        }
    }
}
