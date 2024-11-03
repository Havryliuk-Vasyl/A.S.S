import React, { useState } from 'react';
import SongItem from './SongItem.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import '../styles/song.css';

const SongList = ({ songs, showArtist, showAlbum, isPlayable, menuType, removeSongFromPlaylist }) => {
  const { playFromList } = isPlayable ? usePlayer() : {};

  const handlePlaySong = (songId) => {
    if (isPlayable) {
      playFromList(songId, songs);
    }
  };

  return (
    <div className="song-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            {showArtist && <th>Artist</th>}
            {showAlbum && <th>Album</th>}
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <SongItem
              key={song.id}
              song={song}
              onPlay={handlePlaySong}
              showArtist={showArtist}
              showAlbum={showAlbum}
              menuType={menuType}
              removeSongFromPlaylist={removeSongFromPlaylist}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
