using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using Backend.Models;

namespace Backend.Repositories
{
    public class MediaRepository : IMediaRepository
    {
        private string filePath;

        public MediaRepository()
        {
            this.filePath = "Data/media.xml";
        }

        private List<Media> LoadMedia()
        {
            List<Media> mediaList = new List<Media>();

            if (File.Exists(filePath))
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);

                XmlNodeList mediaNodes = xmlDoc.SelectNodes("//Media");

                foreach (XmlNode mediaNode in mediaNodes)
                {
                    int id = int.Parse(mediaNode.SelectSingleNode("id").InnerText);
                    string title = mediaNode.SelectSingleNode("title").InnerText;
                    string url = mediaNode.SelectSingleNode("url").InnerText;

                    Media media = new Media(id, title, url);
                    mediaList.Add(media);
                }
            }

            return mediaList;
        }

        private void SaveMedia(List<Media> mediaList)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlElement root = xmlDoc.CreateElement("MediaList");
            xmlDoc.AppendChild(root);

            foreach (Media media in mediaList)
            {
                XmlElement mediaElement = xmlDoc.CreateElement("Media");

                XmlElement idElement = xmlDoc.CreateElement("id");
                idElement.InnerText = media.id.ToString();
                mediaElement.AppendChild(idElement);

                XmlElement titleElement = xmlDoc.CreateElement("title");
                titleElement.InnerText = media.title;
                mediaElement.AppendChild(titleElement);

                XmlElement urlElement = xmlDoc.CreateElement("url");
                urlElement.InnerText = media.url;
                mediaElement.AppendChild(urlElement);

                root.AppendChild(mediaElement);
            }

            xmlDoc.Save(filePath);
        }

        public void DeleteById(int id)
        {
            List<Media> mediaList = LoadMedia();
            mediaList.RemoveAll(media => media.id == id);
            SaveMedia(mediaList);
        }

        public List<Media> GetAll()
        {
            return LoadMedia();
        }

        public Media GetById(int id) => LoadMedia().Find(media => media.id == id);

        public void Save(Media media)
        {
            List<Media> mediaList = LoadMedia();

            int maxId = mediaList.Count > 0 ? mediaList.Max(m => m.id) : 0;
            media.id = maxId + 1;

            mediaList.Add(media);
            SaveMedia(mediaList);
        }

        public void Update(Media media)
        {
            List<Media> mediaList = LoadMedia();
            int index = mediaList.FindIndex(m => m.id == media.id);
            if (index != -1)
            {
                mediaList[index] = media;
                SaveMedia(mediaList);
            }
        }
    }
}
