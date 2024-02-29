using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using Backend.Models;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        string filePath;

        public UserRepository()
        {
            this.filePath = "Data/users.xml";
        }

        private List<User> LoadUsers()
        {
            List<User> users = new List<User>();

            if (File.Exists(filePath))
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);

                XmlNodeList userNodes = xmlDoc.SelectNodes("//User");

                foreach (XmlNode userNode in userNodes)
                {
                    int id = int.Parse(userNode.SelectSingleNode("id").InnerText);
                    string username = userNode.SelectSingleNode("username").InnerText;
                    string name = userNode.SelectSingleNode("name").InnerText;
                    string password = userNode.SelectSingleNode("password").InnerText;
                    string email = userNode.SelectSingleNode("email").InnerText;
                    string dateJoined = userNode.SelectSingleNode("date_joined").InnerText;
                    string status = userNode.SelectSingleNode("status").InnerText;

                    User user = new User(username, name, password, email, dateJoined, status);
                    user.id = id;
                    users.Add(user);
                }
            }

            return users;
        }

        private void SaveUsers(List<User> users)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlElement root = xmlDoc.CreateElement("Users");
            xmlDoc.AppendChild(root);

            foreach (User user in users)
            {
                XmlElement userElement = xmlDoc.CreateElement("User");

                XmlElement idElement = xmlDoc.CreateElement("id");
                idElement.InnerText = user.id.ToString();
                userElement.AppendChild(idElement);

                XmlElement usernameElement = xmlDoc.CreateElement("username");
                usernameElement.InnerText = user.username;
                userElement.AppendChild(usernameElement);

                XmlElement nameElement = xmlDoc.CreateElement("name");
                nameElement.InnerText = user.name;
                userElement.AppendChild(nameElement);

                XmlElement passwordElement = xmlDoc.CreateElement("password");
                passwordElement.InnerText = user.password;
                userElement.AppendChild(passwordElement);

                XmlElement emailElement = xmlDoc.CreateElement("email");
                emailElement.InnerText = user.email;
                userElement.AppendChild(emailElement);

                XmlElement dateJoinedElement = xmlDoc.CreateElement("date_joined");
                dateJoinedElement.InnerText = user.date_joined;
                userElement.AppendChild(dateJoinedElement);

                XmlElement statusElement = xmlDoc.CreateElement("status");
                statusElement.InnerText = user.status;
                userElement.AppendChild(statusElement);

                root.AppendChild(userElement);
            }

            xmlDoc.Save(filePath);
        }

        public void deleteById(int id)
        {
            List<User> users = LoadUsers();
            users.RemoveAll(user => user.id == id);
            SaveUsers(users);
        }

        public List<User> getAll()
        {
            return LoadUsers();
        }

        public User getById(int id)
        {
            User? userSerarching = LoadUsers().Find(user => user.id == id);
            User user = userSerarching;
            return user;
        }

        public void save(User user)
        {
            List<User> users = LoadUsers();
            
            int maxId = users.Count > 0 ? users.Max(u => u.id) : 0;
            user.id = maxId + 1;
            
            users.Add(user);
            SaveUsers(users);
        }

        public void update(User user)
        {
            List<User> users = LoadUsers();
            int index = users.FindIndex(u => u.id == user.id);
            if (index != -1)
            {
                users[index] = user;
                SaveUsers(users);
            }
        }
    }
}
