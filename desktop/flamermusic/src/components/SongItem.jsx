import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';

const SongItem = ({ song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { play } = usePlayer();

  const handlePlaySong = () =>{
    play(song.song.id);
  }

  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <tr className="song-item" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <td className="song-title"><img onClick={handlePlaySong} src={isHovered ? require('../../public/assets/icons/player-icons/Play_Greem.svg') : `https://localhost:7219/Song/photo/` + song.song.id} alt={song.song.title} />{song.song.title}</td>
      <td className="song-artist">{song.artist}</td>
      <td className="song-album">{song.song.albumTitle}</td>
      <td> {formatTime(song.duration)} </td>
    </tr>
  );
};

export default SongItem;