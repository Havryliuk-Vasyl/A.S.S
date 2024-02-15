namespace Backend
{
    public class User
    {
        private int id;
        private string username { get; set; }
        private string name { get; set; }
        private string password { get; set; }

        public User(int id, string username, string name, string password)
        {
            this.id = id;
            this.username = username;
            this.name = name;
            this.password = password;
        }
    }
}
