import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import SongList from "../components/SongList.jsx";
import PlaylistOptions from "../components/PlaylistOptions.jsx";

const Album = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const albumId = query.get("songId");

    const [album, setAlbum] = useState({});
    const [songs, setSongs] = useState([]);

    console.log(album);
    
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`https://localhost:7219/Album/song/${albumId}`)
                if (!response.ok){
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAlbum(data.data.data);
                setSongs(data.data.data.songs.$values);
            } catch (error) {
                console.error(error);
            }
        };

        if (albumId) {
            fetchPlaylist();
        }
    }, [albumId]);

    return (
        <div className="playlist-in-display-field">
            <div className="playlist-information" >
                <div className="playlist-image">
                    <img id="playlist-image"
                    src={`https://localhost:7219/Album/photo/${album.id}`} 
                    alt={album.title} 
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
                    }}
                    />
                </div>
                <div className="playlist-name" id="playlist-name">{album.title}</div>
            </div>
            <div className="playlist-control">
                
            </div>
            <div id="songs-container" className="container-style">
                { songs.length > 0 && <SongList songs={songs} showArtist={false} showAlbum={false} /> }
            </div>
        </div>
    );
}

export default Album;