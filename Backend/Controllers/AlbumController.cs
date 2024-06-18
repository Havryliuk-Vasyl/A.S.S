﻿using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("album/{albumId}")]
        public async Task<IActionResult> GetAlbumByAlbumId(int albumId)
        {
            try
            {
                var album = await context.Albums
                    .Include(a => a.AlbumSongs)
                        .ThenInclude(als => als.Song)
                            .ThenInclude(s => s.Audios)
                    .FirstOrDefaultAsync(a => a.Id == albumId);

                if (album == null)
                {
                    return BadRequest();
                }

                var artist = await context.Users.FirstOrDefaultAsync(a => a.Id == album.User);

                if (artist == null)
                {
                    return BadRequest();
                }

                var albumSongs = album.AlbumSongs.Select(als => new
                {
                    SongId = als.Song.Id,
                    SongTitle = als.Song.Title,
                    Audios = als.Song.Audios.Select(audio => new
                    {
                        AudioId = audio.Id,
                        audio.Duration,
                        audio.FilePath
                    })
                });

                var result = new
                {
                    AlbumId = album.Id,
                    AlbumTitle = album.Title,
                    DateShared = album.DateShared,
                    ArtistId = artist.Id,
                    ArtistUsername = artist.Username,
                    Songs = albumSongs
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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

            byte[] photoBytes = await System.IO.File.ReadAllBytesAsync(photo.FilePath);

            return File(photoBytes, "image/jpeg");
        }

        [HttpDelete("{albumId}")]
        public async Task<IActionResult> DeleteAlbum(int albumId)
        {
            try
            {
                var album = await context.Albums.FindAsync(albumId);

                if (album == null)
                {
                    return NotFound();
                }

                var albumSongs = await context.AlbumSongs.Where(als => als.AlbumId == albumId).Select(als => als.SongId).ToListAsync();
                var albumPhotos = await context.AlbumPhotos.Where(ap => ap.Album == albumId).Select(ap => ap.FilePath).ToListAsync();
                var audioFiles = await context.Audios.Where(a => albumSongs.Contains(a.Song)).ToListAsync();
                var songPhotos = await context.Photos.Where(p => albumSongs.Contains(p.SongId)).ToListAsync();

                foreach (var audioFile in audioFiles)
                {
                    System.IO.File.Delete(audioFile.FilePath);
                }
                foreach (var albumPhotoPath in albumPhotos)
                {
                    System.IO.File.Delete(albumPhotoPath);
                }
                foreach (var songPhotoPath in songPhotos)
                {
                    System.IO.File.Delete(songPhotoPath.FilePath);
                }

                context.AlbumSongs.RemoveRange(context.AlbumSongs.Where(als => als.AlbumId == albumId));
                context.AlbumPhotos.RemoveRange(context.AlbumPhotos.Where(ap => ap.Album == albumId));
                context.Audios.RemoveRange(audioFiles);
                context.Albums.Remove(album);

                await context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("songs/{songId}")]
        public async Task<IActionResult> GetAlbumBySongId(int songId)
        {
            try
            {
                // Знаходимо альбом, який містить дану пісню
                var album = await context.Albums
                    .Include(a => a.AlbumSongs)
                        .ThenInclude(als => als.Song)
                            .ThenInclude(s => s.Audios)
                    .FirstOrDefaultAsync(a => a.AlbumSongs.Any(als => als.SongId == songId));

                if (album == null)
                {
                    return NotFound();
                }

                // Знаходимо артиста, який створив альбом
                var artist = await context.Users.FirstOrDefaultAsync(a => a.Id == album.User);

                if (artist == null)
                {
                    return BadRequest();
                }

                var albumSongs = album.AlbumSongs.Select(als => new
                {
                    SongId = als.Song.Id,
                    SongTitle = als.Song.Title,
                    Audios = als.Song.Audios.Select(audio => new
                    {
                        AudioId = audio.Id,
                        audio.Duration,
                        audio.FilePath
                    })
                });

                var result = new
                {
                    AlbumId = album.Id,
                    AlbumTitle = album.Title,
                    DateShared = album.DateShared,
                    ArtistId = artist.Id,
                    ArtistUsername = artist.Username,
                    Songs = albumSongs
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}