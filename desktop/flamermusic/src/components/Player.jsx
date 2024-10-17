import React, { useState, useEffect } from 'react';
import '../styles/player.css';
import AppButton from './AppButton.jsx';
import PlayerInputSlider from './PlayerInputSlider.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

const Player = ({ isModalOpen}) => {
    const { currentSong, isPlaying, handlePlayPause, currentTime, duration, volume, setVolume, audioRef } = usePlayer();
    const [isDragging, setIsDragging] = useState(false);
    const [sliderValue, setSliderValue] = useState(currentTime);
    const { playNextSong, playPrevSong } = usePlayer();

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    };

    useEffect(() => {
        if (!isDragging) {
            setSliderValue(currentTime);
        }
    }, [currentTime, isDragging]);

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = (e) => {
        setIsDragging(false);
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handlePlayPause();
            }

            if (e.ctrlKey && e.code === 'ArrowUp') {
                e.preventDefault();
                const newVolume = Math.min(volume + 0.1, 1);
                handleVolumeChange(newVolume);
            }

            if (e.ctrlKey && e.code === 'ArrowDown') {
                e.preventDefault();
                const newVolume = Math.max(volume - 0.1, 0);
                handleVolumeChange(newVolume);
            }

            if (e.code === 'ArrowRight' && e.ctrlKey) {
                playNextSong();
            }

            if (e.code === 'ArrowLeft' && e.ctrlKey) {
                playPrevSong();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [volume, handlePlayPause]);

    return (
        <div className={`player ${isModalOpen ? 'disabled' : ''}`}>
            <div className="player-audio-player">
                <div className="player-controls">
                    <div className="player-song-information">
                        <div className="player-song-image">
                            <img
                                id="player-song-image"
                                src={currentSong?.id ? `https://localhost:7219/Song/photo/${currentSong.id}` : require('../../public/assets/icons/empty-playlist.png')}
                                alt={currentSong?.title || "No name"}
                            />
                        </div>
                        <div className="player-song-artist-and-title">
                            <div className="player-song-name" id="song-name">
                                <a href="#" id="player-songName">{currentSong?.title || "No name"}</a>
                            </div>
                            <div className="player-artist-name" id="player-artist-name">
                                <a href="#" id="player-songArtist">{currentSong?.artistName || "No artist"}</a>
                            </div>
                        </div>
                    </div>
                    <div className="player-audio-control">
                        <div className="player-control-buttons">
                            <AppButton
                                id="player-prevSongBtn"
                                defaultIcon={require('../../public/assets/icons/player-icons/Prev.svg')}
                                hoverIcon={require('../../public/assets/icons/player-icons/Prev_Hover.svg')}
                                onClick={playPrevSong}
                                altText={'Previous'}
                            />
                            <AppButton
                                id="player-playPauseBtn"
                                defaultIcon={isPlaying ? require('../../public/assets/icons/player-icons/Pause.svg') : require('../../public/assets/icons/player-icons/Play.svg')}
                                hoverIcon={isPlaying ? require('../../public/assets/icons/player-icons/Pause_Hover.svg') : require('../../public/assets/icons/player-icons/Play_Hover.svg')}
                                onClick={handlePlayPause}
                                altText={isPlaying ? 'Pause' : 'Play'}
                            />
                            <AppButton
                                id="player-nextSongBtn"
                                defaultIcon={require('../../public/assets/icons/player-icons/Next.svg')}
                                hoverIcon={require('../../public/assets/icons/player-icons/Next_Hover.svg')}
                                onClick={playNextSong}
                                altText={'Next'}
                            />
                        </div>
                        <div className="player-time-control">
                            <div id="player-currentTime">{formatTime(currentTime)}</div>
                            <PlayerInputSlider
                                id="player-timeSlider"
                                max={duration}
                                value={sliderValue}
                                step="0.1"
                                onChange={(e) => {
                                    setSliderValue(e.target.value);
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                            />
                            <div id="player-duration">{formatTime(duration)}</div>
                        </div>
                    </div>
                    <div className="player-other-controllers">
                        <AppButton
                            id="player-queueBtn"
                            defaultIcon={require('../../public/assets/icons/player-icons/Queue.svg')}
                            hoverIcon={require('../../public/assets/icons/player-icons/Queue_Hover.svg')}
                            altText={'Queue'}
                        />
                        <PlayerInputSlider
                            id="player-volumeSlider"
                            max="1"
                            value={volume}
                            step="0.0001"
                            onChange={(e) => handleVolumeChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
