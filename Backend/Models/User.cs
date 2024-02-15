namespace Backend.Models
{
    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public DateOnly date_joined { get; set; }
        public string status { get; set; }

        public User(string username, string name, string password, string email, DateOnly date_joined, string status)
        {
            this.username = username;
            this.name = name;
            this.password = password;
            this.email = email;
            this.date_joined = date_joined;
            this.status = status;
        }
    }
}
