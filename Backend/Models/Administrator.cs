namespace Backend.Models
{
    public class Administrator : User
    {
        public int AdminLevel;
        public Administrator(int id, string username, string name, string email, string password, DateOnly date_joined, string status, int adminLevel)
        {
            this.Id = id;
            this.Username = username;
            this.Name = name;
            this.Email = email;
            this.Password = password;
            this.DateJoined = date_joined;
            this.status = status;
            this.AdminLevel = adminLevel;
        }
    }
}
