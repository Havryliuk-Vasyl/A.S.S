using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IMediaService
    {
        void AddMedia(Media newMedia);
        List<Media> GetMediaList();
        Media GetMediaById(int id);
        void RemoveMedia(Media media);
    }
}
