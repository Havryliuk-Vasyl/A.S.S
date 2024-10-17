import React from 'react';
import '../styles/playlistOptions.css';

const SongOptions = ({ menuType, position, closeMenu, onPlay, song}) => {
  const handlePlaySong = () => {
    onPlay(song.id);
    closeMenu();
  };  
  
  const contextMenuConfig = {
    song: [
      { label: 'Listen to', action: handlePlaySong },
      { label: 'Add to queue', action: () => console.log('Added to queue') },
      { label: 'Add to playlist', action: () => console.log('Added to playlist') },
    ],
    album: [
      { label: 'Play album', action: () => console.log('Playing album') },
      { label: 'Add album to library', action: () => console.log('Added album to library') },
      { label: 'Share album', action: () => console.log('Sharing album') },
    ],
  };

  const menuItems = contextMenuConfig[menuType] || [];

  return (
    <div 
      className="dropdown-menu" 
      style={{ top: position.y, left: position.x, position: 'absolute' }}
      onMouseLeave={closeMenu}
    >
      {menuItems.map((item, index) => (
        <button key={index} onClick={() => { item.action(); closeMenu(); }}>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SongOptions;
