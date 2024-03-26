namespace Backend.Models
{
    public class Image
    {
        private int id;
        private string url;
        private int[] dimension;

        public Image(int id, string url, int[] dimension)
        {
            this.id = id;
            this.url = url;
            this.dimension = dimension;
        }
    }
}
