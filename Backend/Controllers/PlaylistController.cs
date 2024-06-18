using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly string _playlistPhotoFilePath = "./media-files/playlistphotos";

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

        [HttpPost("uploadPhoto")]
        public async Task<ActionResult> SetPlaylistPhoto([FromForm] IFormFile photoFile, [FromForm] int playlistId)
        {
            try
            {
                if (photoFile == null || photoFile.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                if (!photoFile.ContentType.StartsWith("image/"))
                {
                    return BadRequest("Only image files are allowed");
                }

                if (playlistId <= 0)
                {
                    return BadRequest("Invalid playlist ID");
                }

                var existingPhoto = await context.PlaylistPhotos.FirstOrDefaultAsync(p => p.Playlist == playlistId);
                if (existingPhoto != null)
                {
                    if (System.IO.File.Exists(existingPhoto.FilePath))
                    {
                        System.IO.File.Delete(existingPhoto.FilePath);
                    }
                    context.PlaylistPhotos.Remove(existingPhoto);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(photoFile.FileName);

                var uploadsFolder = Path.Combine(_playlistPhotoFilePath, uniqueFileName);

                using (var stream = new FileStream(uploadsFolder, FileMode.Create))
                {
                    await photoFile.CopyToAsync(stream);
                }

                var playlistPhoto = new PlaylistPhoto
                {
                    Playlist = playlistId,
                    FilePath = uploadsFolder
                };
                context.PlaylistPhotos.Add(playlistPhoto);
                await context.SaveChangesAsync();

                return Ok("Avatar uploaded successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading avatar: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("photo")]
        public async Task<ActionResult> GetPhoto(int playlistId)
        {
            var playlistPhoto = await context.PlaylistPhotos.FirstOrDefaultAsync(p => p.Playlist == playlistId);

            if (playlistPhoto == null)
                return NotFound();

            if (!System.IO.File.Exists(playlistPhoto.FilePath))
                return NotFound();

            byte[] photoBytes = System.IO.File.ReadAllBytes(playlistPhoto.FilePath);
            return File(photoBytes, "image/*");
        }

        [HttpGet("Playlist/{playlistId}")]
        public async Task<ActionResult<object>> GetPlaylistWithSongs(int playlistId)
        {
            try
            {
                var playlist = await context.Playlists
                    .Where(p => p.Id == playlistId)
                    .Include(p => p.PlaylistSongs)
                        .ThenInclude(ps => ps.Song)
                            .ThenInclude(s => s.Audios)
                    .FirstOrDefaultAsync();

                if (playlist == null)
                {
                    return NotFound($"Playlist with id {playlistId} not found.");
                }

                var songsResponse = new List<object>();

                foreach (var ps in playlist.PlaylistSongs)
                {
                    var song = ps.Song;
                    var artist = await context.Users.FirstOrDefaultAsync(a => a.Id == song.Artist);

                    var photo = await context.Photos.FirstOrDefaultAsync(p => p.SongId == song.Id);

                    var songResponse = new
                    {
                        SongId = song.Id,
                        SongTitle = song.Title,
                        ArtistId = artist.Id,
                        ArtistUsername = artist.Username,
                        Audios = song.Audios.Select(audio => new
                        {
                            AudioId = audio.Id,
                            audio.Duration,
                            audio.FilePath
                        }),
                        Photo = photo
                    };

                    songsResponse.Add(songResponse);
                }

                var response = new
                {
                    PlaylistId = playlist.Id,
                    PlaylistTitle = playlist.Title,
                    Songs = songsResponse
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving playlist with songs: {ex.Message}");
            }
        }


        [HttpDelete("{playlistId}/RemoveSong/{songId}")]
        public async Task<ActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            try
            {
                var playlist = await context.Playlists.FirstOrDefaultAsync(p => p.Id == playlistId);

                if (playlist == null)
                {
                    return NotFound($"Playlist with id {playlistId} not found.");
                }

                var playlistSong = await context.PlaylistSongs.FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

                if (playlistSong == null)
                {
                    return NotFound($"Song with id {songId} not found in playlist with id {playlistId}.");
                }

                context.PlaylistSongs.Remove(playlistSong);
                await context.SaveChangesAsync();

                return Ok($"Song with id {songId} removed from playlist with id {playlistId} successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error removing song from playlist: {ex.Message}");
            }
        }

        [HttpDelete("{playlistId}")]
        public async Task<ActionResult> DeletePlaylist(int playlistId)
        {
            try
            {
                var playlist = await context.Playlists.FirstOrDefaultAsync(p => p.Id == playlistId);

                if (playlist == null)
                {
                    return NotFound($"Playlist with id {playlistId} not found.");
                }

                context.Playlists.Remove(playlist);
                await context.SaveChangesAsync();

                return Ok($"Playlist with id {playlistId} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting playlist: {ex.Message}");
            }
        }


        [HttpPut("editplaylist")]
        public async Task<ActionResult> EditPlaylist(int playlistId, [FromBody] string newPlaylistName)
        {
            try
            {
                Playlist playlist = await context.Playlists.FirstOrDefaultAsync(p => p.Id == playlistId);

                if (playlist == null)
                {
                    return NotFound();
                }

                if (!string.IsNullOrEmpty(newPlaylistName))
                {
                    playlist.Title = newPlaylistName;
                }
                else
                {
                    return BadRequest("New playlist name is empty!");
                }

                context.Playlists.Update(playlist);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }
    }
}
