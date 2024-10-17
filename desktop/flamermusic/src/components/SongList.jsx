import React, { useEffect, useState } from 'react';
import SongItem from './SongItem.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import '../styles/song.css';

const SongList = ({ songs , showArtist, showAlbum}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { playFromList } = usePlayer();

  useEffect(() => {
  }, []);

  const handlePlaySong = (songId) => {
    playFromList(songId, songs);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <SongItem key={song.id} song={song} onPlay={handlePlaySong} showArtist={showArtist} showAlbum={showAlbum}/>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
