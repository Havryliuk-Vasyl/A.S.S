using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistService playlistService;

        public PlaylistController(IPlaylistService playlistService)
        {
            this.playlistService = playlistService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylistsForUser(int userId)
        {
            var response = await playlistService.GetPlaylistsForUser(userId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreatePlaylist([FromBody] CreatePlaylistRequest request)
        {
            var response = await playlistService.CreatePlaylist(request);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpPost("{playlistId}/AddSong")]
        public async Task<ActionResult<object>> AddSongToPlaylist(int playlistId, [FromBody] int songId)
        {
            var response = await playlistService.AddSongToPlaylist(playlistId, songId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpPost("uploadPhoto")]
        public async Task<ActionResult<object>> SetPlaylistPhoto([FromForm] byte[] photoFile, [FromForm] int playlistId)
        {
            var response = await playlistService.SetPlaylistPhoto(photoFile, playlistId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpGet("photo")]
        public async Task<ActionResult<byte[]>> GetPhoto(int playlistId)
        {
            var response = await playlistService.GetPhoto(playlistId);
            return response.Success ? File(response.Data, "image/*") : BadRequest();
        }

        [HttpGet("Playlist/{playlistId}")]
        public async Task<ActionResult<object>> GetPlaylistWithSongs(int playlistId)
        {
            var response = await playlistService.GetPlaylistWithSongs(playlistId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpDelete("{playlistId}/RemoveSong/{songId}")]
        public async Task<ActionResult<object>> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var response = await playlistService.DeleteSongFromPlaylist(playlistId, songId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpDelete("{playlistId}")]
        public async Task<ActionResult<object>> DeletePlaylist(int playlistId)
        {
            var response = await playlistService.DeletePlaylist(playlistId);
            return response.Success ? Ok(response) : BadRequest();
        }

        [HttpPut("editplaylist")]
        public async Task<ActionResult<object>> EditPlaylist([FromQuery] int playlistId, [FromBody] string newPlaylistName)
        {
            var response = await playlistService.EditPlaylist(playlistId, newPlaylistName);
            return response.Success ? Ok(response) : BadRequest();
        }
    }
}
