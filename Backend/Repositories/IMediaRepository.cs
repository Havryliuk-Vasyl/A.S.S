using System.Collections.Generic;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IMediaRepository
    {
        void DeleteById(int id);
        List<Media> GetAll();
        Media GetById(int id);
        void Save(Media media);
        void Update(Media media);
    }
}
