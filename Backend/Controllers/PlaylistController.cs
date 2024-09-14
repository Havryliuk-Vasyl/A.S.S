using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistService _playlistService;

        public PlaylistController(IPlaylistService playlistService)
        {
            _playlistService = playlistService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Playlist>>>> GetPlaylistsForUser(int userId)
        {
            var response = await _playlistService.GetPlaylistsForUser(userId);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> CreatePlaylist([FromBody] CreatePlaylistRequest request)
        {
            var response = await _playlistService.CreatePlaylist(request);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPost("{playlistId}/AddSong")]
        public async Task<ActionResult<ApiResponse<object>>> AddSongToPlaylist(int playlistId, [FromBody] int songId)
        {
            var response = await _playlistService.AddSongToPlaylist(playlistId, songId);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPost("uploadPhoto")]
        public async Task<ActionResult<ApiResponse<object>>> SetPlaylistPhoto([FromForm] IFormFile photoFile, [FromForm] int playlistId)
        {
            var response = await _playlistService.SetPlaylistPhoto(photoFile, playlistId);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpGet("photo")]
        public async Task<ActionResult<ApiResponse<byte[]>>> GetPhoto(int playlistId)
        {
            var response = await _playlistService.GetPhoto(playlistId);
            return response.Success ? File(response.Data, "image/*") : StatusCode(StatusCodes.Status404NotFound, response);
        }

        [HttpGet("Playlist/{playlistId}")]
        public async Task<ActionResult<ApiResponse<object>>> GetPlaylistWithSongs(int playlistId)
        {
            var response = await _playlistService.GetPlaylistWithSongs(playlistId);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status404NotFound, response);
        }

        [HttpDelete("{playlistId}/RemoveSong/{songId}")]
        public async Task<ActionResult<ApiResponse<object>>> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var response = await _playlistService.DeleteSongFromPlaylist(playlistId, songId);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpDelete("{playlistId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeletePlaylist(int playlistId)
        {
            var response = await _playlistService.DeletePlaylist(playlistId);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        [HttpPut("editplaylist")]
        public async Task<ActionResult<ApiResponse<object>>> EditPlaylist([FromQuery] int playlistId, [FromBody] string newPlaylistName)
        {
            var response = await _playlistService.EditPlaylist(playlistId, newPlaylistName);
            return response.Success ? Ok(response) : StatusCode(StatusCodes.Status500InternalServerError, response);
        }
    }
}
