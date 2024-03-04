using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;

        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        [HttpGet("media")]
        public IActionResult GetMediaList()
        {
            var mediaList = _mediaService.GetMediaList();
            return Ok(mediaList);
        }

        [HttpGet("media/{id}")]
        public IActionResult GetMediaById(int id)
        {
            var media = _mediaService.GetMediaById(id);
            if (media == null)
            {
                return NotFound();
            }
            return Ok(media);
        }

        [HttpPost]
        public IActionResult Post([FromForm] IFormFile file, [FromBody] Media newMedia)
        {
            newMedia.url = "media-files/audio" + newMedia.title;
            _mediaService.AddMedia(file, newMedia);
            return Ok("Media added successfully");
        }
    }
}
