using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IUploadService uploadService;

        public UploadController(UploadService uploadService)
        {
            this.uploadService = uploadService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadSong([FromForm] AudioUploadModel audioUploadModel)
        {
            var response = await uploadService.Upload(audioUploadModel);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
