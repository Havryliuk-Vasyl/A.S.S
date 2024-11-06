import React, { useState } from "react";
import "../styles/search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    songs: [],
    albums: [],
    users: []
  });

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://localhost:7219/Search/all?data=${encodeURIComponent(query)}`,
        {
          headers: { accept: "*/*" }
        }
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      console.log(data);
      displaySearchResults(data.data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const displaySearchResults = (response) => {
    if (response && response.$values) {
      const songs = response.$values.filter(item => item.type === "Song");
      const albums = response.$values.filter(item => item.type === "Album");
      const users = response.$values.filter(item => item.type === "User");

      setResults({ songs, albums, users });
    } else {
      setResults({ songs: [], albums: [], users: [] });
    }
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
          Шукати
        </button>
      </div>

      <div id="searchResults">
        <div className="search-song">
          <div className="result-info-type">Songs</div>
          {results.songs.map((song) => (
            <div key={song.id} className="catalog-song" data-id={song.id}>
              <div className="catalog-song-information">
                <div className="catalog-song-photo">
                  <img
                    src={`https://localhost:7219/Song/photo/${song.id}`}
                    alt="Photo"
                    style={{ maxWidth: "50px", maxHeight: "50px", width: "100%", height: "100%" }}
                  />
                </div>
                <div className="catalog-song-name">{song.title}</div>
                <div className="catalog-artist">{song.artistName}</div>
              </div>
              <div className="catalog-song-play-control">
                <div className="catalog-duration">{formatDuration(song.duration)}</div>
                <button onClick={() => {}}>▶</button>
              </div>
            </div>
          ))}
        </div>

        <div className="search-album">
          <div className="result-info-type">Albums</div>
          {results.albums.map((album) => (
            <div key={album.id} className="album">
              <div className="album-photo">
                <img src={`https://localhost:7219/Album/photo/${album.id}`} alt="Album" />
              </div>
              <div className="album-title">{album.name}</div>
            </div>
          ))}
        </div>

        <div className="search-user">
          <div className="result-info-type">Users</div>
          {results.users.map((user) => (
            <div key={user.id} className="catalog-user" data-id={user.id}>
              <div className="catalog-user-information">
                <div className="album-photo">
                  <img src={`https://localhost:7219/User/avatar/${user.id}`} alt="User" />
                </div>
                <div className="catalog-user-name">{user.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
