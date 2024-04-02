using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("user")]
    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public DateOnly date_joined { get; set; }
        public string status { get; set; }

        public User(int id, string username, string name, string email, string password, DateOnly date_joined, string status)
        {
            this.id = id;
            this.username = username;
            this.name = name;
            this.email = email;
            this.password = password; 
            this.date_joined = date_joined;
            this.status = status;
        }
        public User(string username, string name, string email, string password, DateOnly date_joined, string status)
        {
            this.id = id;
            this.username = username;
            this.name = name;
            this.email = email;
            this.password = password;
            this.date_joined = date_joined;
            this.status = status;
        }
    }
}
