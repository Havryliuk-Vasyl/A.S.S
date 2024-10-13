import React, { useEffect, useState } from 'react';
import SongItem from './SongItem.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import '../styles/song.css';

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playFromList } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('https://localhost:7219/Song');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSongs(data.data.$values);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
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
            <th>Artist</th>
            <th>Album</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <SongItem key={song.id} song={song} onPlay={handlePlaySong}/>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
