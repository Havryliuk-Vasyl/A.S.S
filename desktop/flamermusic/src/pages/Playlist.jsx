import React, { useState, useEffect, useRef } from "react";
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
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedImage, setUpdatedImage] = useState(null);

    const imageInputRef = useRef(null);

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
                setUpdatedTitle(data.data.playlistTitle);
            } catch (error) {
                console.error(error);
            }
        };

        if (playlistId) {
            fetchPlaylist();
        }
    }, [playlistId]);

    const PlaylistInformation = ({ playlist }) => (
        <div className="playlist-information" onClick={openModal}>
            <div className="playlist-image">
                <img 
                    id="playlist-image"
                    src={`https://localhost:7219/Playlist/photo?playlistId=${playlist.playlistId}`} 
                    alt={playlist.title} 
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
                    }}
                />
            </div>
            <div className="playlist-name" id="playlist-name">{playlist.playlistTitle}</div>
        </div>
    );

    const handleTitleChange = (newTitle) => {
        setUpdatedTitle(newTitle);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUpdatedImage(e.target.files[0]);
        }
    };

    const triggerImageUpload = () => {
        imageInputRef.current.click();
    };

    const PlaylistInformationElement = (
        <PlaylistInformation 
            playlist={playlist} 
        />
    );

    const EditPlaylistInformation = (
        <div className="playlist-information">
            <div className="playlist-image" onClick={triggerImageUpload}>
                <img 
                    id="playlist-image"
                    src={updatedImage ? URL.createObjectURL(updatedImage) : `https://localhost:7219/Playlist/photo?playlistId=${playlist.playlistId}`} 
                    alt={playlist.title} 
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
                    }}
                />
                <input 
                    type="file" 
                    ref={imageInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleImageChange} 
                />
            </div>
            <input 
                type="text" 
                value={updatedTitle}
                onChange={(e) => handleTitleChange(e.target.value)} 
                className="playlist-name-input"
            />
        </div>
    );

    return (
        <div className="playlist-in-display-field">
            <PlaylistInformation playlist={playlist} />
            <div className="playlist-control">
                <PlaylistOptions playlist={playlist} EditPlaylistInformation={EditPlaylistInformation}/>
            </div>
            <div id="songs-container" className="container-style">
                {songs.length > 0 && <SongList songs={songs} showArtist={true} showAlbum={true} />}
            </div>
            <EditPlaylistModal 
                playlist={playlist} 
                isOpen={isModalOpen} 
                closeModal={closeModal} 
                playlistInformation={EditPlaylistInformation} 
            />
        </div>
    );
}

export default Playlist;