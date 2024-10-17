import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import EditPlaylistModal from "../components/modals/EditPlaylistModal.jsx";
import SongList from "../components/SongList.jsx";
import PlaylistOptions from "../components/PlaylistOptions.jsx";

const Playlist = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const playlistId = query.get("id");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [playlist, setPlaylist] = useState({});
    const [songs, setSongs] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`https://localhost:7219/Playlist/Playlist/${playlistId}`)
                if (!response.ok){
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylist(data.data);
                setSongs(data.data.songs.$values);
            } catch (error) {
                console.error(error);
            }
        };

        if (playlistId) {
            fetchPlaylist();
        }
    }, [playlistId]);

    return (
        <div className="playlist-in-display-field">
            <div className="playlist-information" onClick={openModal}>
                <div className="playlist-image">
                    <img id="playlist-image"
                    src={`https://localhost:7219/Playlist/photo?playlistId=${playlist.id}`} 
                    alt={playlist.title} 
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
                    }}
                    />
                </div>
                <div className="playlist-name" id="playlist-name">{playlist.playlistTitle}</div>
            </div>
            <div className="playlist-control">
                <PlaylistOptions playlist={playlist}/>
            </div>
            <div id="songs-container" className="container-style">
                { songs.length > 0 && <SongList songs={songs} showArtist={true} showAlbum={true}/> }
            </div>
            <EditPlaylistModal playlist={playlist} isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
}

export default Playlist;