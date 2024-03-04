using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IMediaService
    {
        void AddMedia(IFormFile file ,Media newMedia);
        List<Media> GetMediaList();
        Media GetMediaById(int id);
        void RemoveMedia(Media media);
    }
}
