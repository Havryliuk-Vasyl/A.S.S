import React from 'react';
import '../styles/playlistOptions.css';

const SongOptions = ({ song, position, closeMenu, onPlay }) => {
  
  const handlePlaySong = () => {
    onPlay(song.id);
    closeMenu();
  };
  
  return (
    <div
      className="dropdown-menu" 
      style={{ top: position.y, left: position.x, position: 'absolute' }}
      onMouseLeave={closeMenu}
    >
      <button onClick={handlePlaySong}>Listen to</button>
      <button onClick={closeMenu}>Add to queue</button>
      <button onClick={closeMenu}>Add to playlist</button>
    </div>
  );
};

export default SongOptions;
