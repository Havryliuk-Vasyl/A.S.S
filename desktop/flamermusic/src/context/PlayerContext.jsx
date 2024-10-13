import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    const playSong = async (songId) => {
        const apiUrl = `https://localhost:7219/Audio/${songId}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const audioData = await response.arrayBuffer();
            const audioUrl = URL.createObjectURL(new Blob([audioData]));

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.onloadedmetadata = () => {
                    setDuration(Math.floor(audioRef.current.duration));
                };
                audioRef.current.play().then(() => setIsPlaying(true));
            }
        } catch (error) {
            console.error('Error fetching audio file:', error);
        }
    };

    const play = async (songId) => {
        const apiUrl = `https://localhost:7219/Song/${songId}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const song = await response.json();
            setCurrentSong(song.data);
            await playSong(songId);
        } catch (error) {
            console.error("Error fetching song details:", error);
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().then(() => setIsPlaying(true));
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <PlayerContext.Provider value={{ play, currentSong, isPlaying, handlePlayPause, currentTime, duration, volume, setVolume, audioRef }}>
            {children}
            <audio 
                ref={audioRef} 
                onEnded={() => setIsPlaying(false)} 
                volume={volume}
            />
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);