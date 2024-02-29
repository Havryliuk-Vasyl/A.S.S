namespace Backend.Models
{
    public class Media
    {
        public int id {get; set;} 
        public string title { get; set; } 
        public string url { get; set; }
        
        public Media(int id, string title, string url)
        {
            this.id = id;
            this.title = title;
            this.url = url;
        }
    }
}
