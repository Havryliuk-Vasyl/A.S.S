namespace Backend.Models
{
    public class Image
    {
        private int id { get; set; }
        private string url { get; set; }
        private int[] dimensions { get; set; }

        public Image(int id, string url, int[] dimensions)
        {
            this.id = id;
            this.url = url;
            this.dimensions = dimensions;
        }
    }
}
