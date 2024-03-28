using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class UserLogin
    {
        public string email { get; set; }
        public string password { get; set; }
        public UserLogin(string email, string password)
        {
            this.email = email;
            this.password = password;
        }
    }
}
