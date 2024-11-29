import React, { useState } from 'react';
import SongOptions from './MenuConfig.jsx';
import AddSongToPlaylistModal from './modals/AddSongToPlaylistModal.jsx';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://localhost:7219/";

const SongItem = ({ song, onPlay, showArtist, showAlbum, menuType, removeSongFromPlaylist, isPlayable }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  const handlePlaySong = () => {
    onPlay(song.id);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setIsMenuOpen(true);
  };

  const handleGoToUserPage = () => {
    navigate(`/user?id=${song.artistId}`); 
  };

  const handleGoToAlbumPage = () => {
    navigate(`/album?songId=${song.id}`);
  };

  const closeMenu = () => setIsMenuOpen(false);
  
  const handleAddToPlaylist = () => {
    setIsModalOpen(true);
    closeMenu();
  };

  const handleRemoveSongFromPlaylist = () => {
    removeSongFromPlaylist(song.id);
    closeMenu();
  };

  const closeModal = () => setIsModalOpen(false);

  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <tr 
        className="song-item" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        <td className="song-title">
          <img 
            onClick={handlePlaySong} 
            src={isHovered && isPlayable ? require('../../public/assets/icons/player-icons/Play_Greem.svg') : `${API_URL}Song/photo/${song.id}`}
            alt={song.title} 
          />
          <p onClick={handleGoToAlbumPage}>{song.title}</p>
        </td>
        {showArtist && (
          <td className="song-artist" onClick={handleGoToUserPage}>{song.artist}</td>
        )}
        {showAlbum && <td className="song-album" onClick={handleGoToAlbumPage}>{song.albumTitle}</td>}
        <td className="song-duration">{formatTime(song.duration)}</td>

        {isMenuOpen && (
          <SongOptions 
            menuType={menuType}
            song={song} 
            position={menuPosition} 
            closeMenu={closeMenu} 
            onPlay={handlePlaySong}
            onAddToPlaylist={handleAddToPlaylist}
            removeSongFromPlaylist={handleRemoveSongFromPlaylist}
          />
        )}
      </tr>

      {isModalOpen && (
        <AddSongToPlaylistModal 
          isOpen={isModalOpen} 
          closeModal={closeModal} 
          song={song} 
        />
      )}
    </>
  );
};

export default SongItem;
