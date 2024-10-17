import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [songList, setSongList] = useState([]);
    const currentSongIndex = useRef(0);
    const audioRef = useRef(null);

    const playFromList = async (songId, songs) => {
        setSongList(songs);
        currentSongIndex.current = songs.findIndex(song => song.id === songId);
        await play(songId);
    };

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

    const playNextSong = () => {
        if (songList.length > 0){
            currentSongIndex.current += 1;
            if (currentSongIndex.current >= songList.length) {
                currentSongIndex.current = 0;
            }
            const nextSong = songList[currentSongIndex.current];
            play(nextSong.id);
        }
    }

    const playPrevSong = () => {
        if (songList.length > 0){
            currentSongIndex.current -= 1;
            if (currentSongIndex.current < 0) {
                currentSongIndex.current = songList.length - 1;
            }
            const prevSong = songList[currentSongIndex.current];
            play(prevSong.id);
        }
    }

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
        <PlayerContext.Provider value={{ play, playFromList, playNextSong, playPrevSong, currentSong, currentSongIndex, isPlaying, handlePlayPause, currentTime, duration, volume, setVolume, audioRef }}>
            {children}
            <audio 
                ref={audioRef} 
                onEnded={playNextSong} 
                volume={volume}
            />
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);