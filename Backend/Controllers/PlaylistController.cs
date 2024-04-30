using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public PlaylistController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylistsForUser(int userId)
        {
            try
            {
                var playlists = await context.Playlists
                    .Where(p => p.User == userId)
                    .ToListAsync();
                return Ok(playlists);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving playlists: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Playlist>> CreatePlaylist([FromBody] CreatePlaylistRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request data is null.");
            }

            try
            {
                var playlist = new Playlist
                {
                    Title = request.Title,
                    User = request.UserId
                };

                context.Playlists.Add(playlist);

                await context.SaveChangesAsync();

                return CreatedAtAction("GetPlaylistsForUser", new { userId = request.UserId, id = playlist.Id }, playlist);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating playlist: {ex.Message}");
            }
        }

        [HttpPost("{playlistId}/AddSong")]
        public async Task<ActionResult> AddSongToPlaylist(int playlistId, [FromBody] int songId)
        {
            try
            {
                var playlist = await context.Playlists.FirstOrDefaultAsync(p => p.Id == playlistId);

                if (playlist == null)
                {
                    return NotFound($"Playlist with id {playlistId} not found.");
                }
                var song = await context.Songs.FirstOrDefaultAsync(s => s.Id == songId);
                if (song == null)
                {
                    return NotFound($"Song with id {songId} not found.");
                }

                var playlistSong = new PlaylistSong
                {
                    PlaylistId = playlistId,
                    SongId = songId
                };

                context.PlaylistSongs.Add(playlistSong);

                await context.SaveChangesAsync();

                return Ok($"Song with id {songId} added to playlist with id {playlistId} successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding song to playlist: {ex.Message}");
            }
        }

        [HttpGet("Playlist/{playlistId}")]
        public async Task<ActionResult<Playlist>> GetPlaylistWithSongs(int playlistId)
        {
            try
            {
                var playlist = await context.Playlists
                    .Where(p => p.Id == playlistId)
                    .Include(p => p.PlaylistSongs)
                    .ThenInclude(ps => ps.Song) 
                    .ToListAsync();

                if (playlist == null)
                {
                    return NotFound($"Playlist with id {playlistId} not found.");
                }

                return Ok(playlist);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving playlist with songs: {ex.Message}");
            }
        }
    }
}
