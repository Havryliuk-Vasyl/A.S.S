using Backend.Models;
using Backend.Repositories;
using System;
using System.Collections.Generic;

namespace Backend.Services
{
    public class MediaService : IMediaService
    {
        private readonly IMediaRepository mediaRepository;
        private readonly IAudioFileRepository audioFileRepository;

        public MediaService()
        {
            mediaRepository = new MediaRepository();
            audioFileRepository = new AudioFileRepository();
        }

        public void AddMedia(IFormFile file, Media newMedia)
        {
            try
            {
                audioFileRepository.Save(file, newMedia.title);
                mediaRepository.Save(newMedia);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding media: {ex.Message}");
                throw;
            }
        }

        public Media GetMediaById(int id)
        {
            try
            {
                return mediaRepository.GetById(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting media: {ex.Message}");
                throw;
            }
        }

        public List<Media> GetMediaList()
        {
            try
            {
                return mediaRepository.GetAll();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting media list: {ex.Message}");
                throw;
            }
        }

        public void RemoveMedia(Media media)
        {
            try
            {
                mediaRepository.DeleteById(media.id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing media: {ex.Message}");
                throw;
            }
        }
    }
}
