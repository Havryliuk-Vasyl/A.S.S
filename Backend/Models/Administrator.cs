namespace Backend.Models
{
    public class Administrator : User
    {
        public int AdminLevel;
        public Administrator(int id, string username, string name, string email, string password, DateOnly date_joined, string status, int adminLevel)
            : base(id, username, name, email, password, date_joined, status)
        {
            this.AdminLevel = adminLevel;
        }
    }
}
