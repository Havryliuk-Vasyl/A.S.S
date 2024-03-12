using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class UserRegistrate
    {
        public string username { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public UserRegistrate(string username, string name, string email, string password)
        {
            this.username = username;
            this.name = name;
            this.email = email;
            this.password = password;
        }
    }
}
