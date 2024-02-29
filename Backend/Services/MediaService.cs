using Backend.Models;
using Backend.Repositories;
using System;
using System.Collections.Generic;

namespace Backend.Services
{
    public class MediaService : IMediaService
    {
        private readonly IMediaRepository mediaRepository;

        public MediaService()
        {
            mediaRepository = new MediaRepository();
        }

        public void AddMedia(Media newMedia)
        {
            try
            {
                mediaRepository.Save(newMedia);
            }
            catch (Exception ex)
            {
                // Обробка помилок
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
                // Обробка помилок
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
