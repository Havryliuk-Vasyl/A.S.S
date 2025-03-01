import React, { createContext, useState, useContext } from "react";
import { Audio } from "expo-av";

interface PlayerContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  setCurrentTrackMethod: (url: string) => void;
  playTrack: (url: string) => void;
  togglePlay: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const setCurrentTrackMethod = (url: string) => setCurrentTrack(url); 

  const playTrack = async (url: string) => {
    try {
        if (sound) {
          await sound.stopAsync().catch(() => {});
          await sound.unloadAsync().catch(() => {});
          setSound(null);
        }
    
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
    
        setSound(newSound);
        setCurrentTrack(url);
        setIsPlaying(true);
    
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error("Помилка відтворення:", error);
      }
  };

  const togglePlay = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <PlayerContext.Provider value={{ isPlaying, currentTrack, setCurrentTrackMethod, playTrack, togglePlay }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
