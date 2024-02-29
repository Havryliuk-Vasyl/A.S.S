namespace Backend.Models
{
    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string date_joined { get; set; }
        public string status { get; set; }

        public User(string username, string name, string password, string email, string date_joined, string status)
        {
            this.username = username;
            this.name = name;
            this.password = password;
            this.email = email;
            this.date_joined = date_joined;
            this.status = status;
        }

        public void SetId(int id) { this.id = id; }
        public void SetUsername(string username) { this.username = username; }
        public void SetName(string name) { this.name = name; }
        public void SetPassword(string password) { this.password = password; }
        public void SetEmail(string email) { this.email = email; }
        public void SetDateJoined(string date_joined) { this.date_joined = date_joined; }
        public void SetStatus(string status) { this.status = status; }

        public int GetId() { return this.id; }
        public string GetUsername() { return this.username; }
        public string GetName() { return this.name; }
        public string GetPassword() { return this.password; }
        public string GetEmail() { return this.email; }
        public string GetDateJoined() { return this.date_joined; }
        public string GetStatus() { return this.status; }
    }
}
