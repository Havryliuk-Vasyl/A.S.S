using Backend.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Backend.Services
{
    public interface IAudioStreamingService
    {
        byte[] GetAudioFile(Media media);
    }
}
