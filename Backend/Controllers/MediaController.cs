using Backend.Models;
using Backend.Services;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.Json;
using Newtonsoft.Json;
using System.Collections.Generic;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        [HttpPost("media/upload")]
        [Consumes("multipart/form-data")]
        public IActionResult _upload(IFormFile file)
        {
            
            return Ok();
        }
    }
}
