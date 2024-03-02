
using Backend.Models;

namespace Backend.Services
{
    public class AudioStreamingService : IAudioStreamingService
    {
        public AudioStreamingService()
        {

        }

        public byte[]? GetAudioFile(Media media)
        {
            try
            {
                if (media == null)
                {
                    throw new Exception();
                }
                else
                {
                    byte[] audioBytes = File.ReadAllBytes(media.url);
                    return audioBytes;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
