import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";
import SongList from "../components/SongList.jsx";
import AlbumCard from "../components/AlbumCard.jsx";
import UserCard from "../components/UserCard.jsx";

const API_URL = "https://localhost:7219/";

const Search = () => {
  const navigate = useNavigate();
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    songs: [],
    albums: [],
    users: []
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${API_URL}Search/all?data=${encodeURIComponent(query)}`,
        {
          headers: { accept: "*/*" }
        }
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      console.log(data);
      displaySearchResults(data?.data?.$values || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const displaySearchResults = (items) => {
    const songs = items.filter(item => item.type === "Song");
    const albums = items.filter(item => item.type === "Album");
    const users = items.filter(item => item.type === "User");

    setResults({ songs, albums, users });
  };

  const handleGoToUser = (userId) => {
    navigate(`/user?id=${userId}`);
  };

  const handleGoToAlbum = (albumId) => {
    navigate(`/album?albumId=${albumId}`);
  };

  const handleGoToSong = (playlistId) => {
    navigate(`/playlist?id=${playlistId}`);
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="search-div">
      <div className="search-container">
        <input
          type="text"
          id="searchInput"
          placeholder="Введіть пошуковий запит"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button id="searchButton" onClick={handleSearch}>
          Search
        </button>
      </div>

      {hasSearched && (
        <div id="searchResults">
          <div className="search-song">
            <div className="result-info-type">Songs</div>
            {results.songs.length > 0 ? (
              <SongList songs={results.songs} showArtist={false} showAlbum={false} isPlayable={true} menuType="song" />
            ) : (
              <div>No songs found</div>
            )}
          </div>

          <div className="search-album">
            <div className="result-info-type">Albums</div>
            {results.albums.length > 0 ? (
              results.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))
            ) : (
              <div>No albums found</div>
            )}
          </div>

          <div className="search-user">
            <div className="result-info-type">Users</div>
            {results.users.length > 0 ? (
              results.users.map((user) => (
                <UserCard key={user.id} user={user}/>
              ))
            ) : (
              <div>No users found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
