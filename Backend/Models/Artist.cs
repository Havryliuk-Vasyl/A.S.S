using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Artist : User
    {
        public ICollection<Song> Songs { get; set; }

        public Artist(int id, string username, string name, string email, string password, DateOnly date_joined, string status)
            : base(id, username, name, email, password, date_joined, status)
        {
            Songs = new List<Song>();
        }
    }
}
