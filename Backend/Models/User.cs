using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("user")]
    public class User
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("username")]
        public string Username { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("password")]
        public string Password { get; set; }
        [Column("date_joined")]
        public DateOnly DateJoined { get; set; }
        [Column("status")]
        public string status { get; set; }
        public User()
        {
        }
        public User(int id, string username, string name, string email, string password, DateOnly date_joined, string status)
        {
            this.Id = id;
            this.Username = username;
            this.Name = name;
            this.Email = email;
            this.Password = password; 
            this.DateJoined = date_joined;
            this.status = status;
        }
        public User(string username, string name, string email, string password, DateOnly date_joined, string status)
        {
            this.Username = username;
            this.Name = name;
            this.Email = email;
            this.Password = password;
            this.DateJoined = date_joined;
            this.status = status;
        }
    }

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
