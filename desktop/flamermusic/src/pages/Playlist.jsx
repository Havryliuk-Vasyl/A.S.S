import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

import EditPlaylistModal from "../components/modals/EditPlaylistModal.jsx";
import SongList from "../components/SongList.jsx";
import PlaylistOptions from "../components/PlaylistOptions.jsx";
import { deleteSongFromPlaylist } from "../services/playlistService.jsx";

const Playlist = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const playlistId = query.get("id");

    const { user } = useUser();
    const navigate = useNavigate(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlist, setPlaylist] = useState({});
    const [songs, setSongs] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const updatePlaylistInfo = (updatedPlaylist) => {
        setPlaylist(updatedPlaylist);
    };

    const isNotUsersPlaylist = () => {
        return parseInt(playlist.user) !== parseInt(user?.id);
    };

    const removeSongFromPlaylist = async (songId) => {
        deleteSongFromPlaylist(playlist.playlistId, songId);
        navigate(0);
    }

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`https://localhost:7219/Playlist/Playlist/${playlistId}`);
                if (!response.ok) {
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

    const PlaylistInformation = ({ playlist }) => (
        <div className="playlist-information">
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

    return (
        <div className="playlist-in-display-field">
            <PlaylistInformation playlist={playlist} />
            {!isNotUsersPlaylist() && (
                <div className="playlist-control">
                    <PlaylistOptions playlist={playlist} updatePlaylist={updatePlaylistInfo} />
                </div>
            )}
            <div id="songs-container" className="container-style">
                {songs.length > 0 && <SongList songs={songs} showArtist={true} showAlbum={true} isPlayable={true} menuType={"playlist"} removeSongFromPlaylist={removeSongFromPlaylist}/>}
            </div>
            {!isNotUsersPlaylist() && (
                <EditPlaylistModal 
                    playlistToEdit={playlist} 
                    isOpen={isModalOpen} 
                    closeModal={closeModal} 
                    updatePlaylist={updatePlaylistInfo}
                />
            )}
        </div>
    );
};

export default Playlist;
