
using Backend.Models;

namespace Backend.Services
{
    public class AudioStreamingService : IAudioStreamingService
    {
        public AudioStreamingService() { 
            
        }

        public byte[] GetAudioFile(Media media)
        {
            byte[] audioBytes = File.ReadAllBytes(media.url);
            return audioBytes;
        }
    }
}
