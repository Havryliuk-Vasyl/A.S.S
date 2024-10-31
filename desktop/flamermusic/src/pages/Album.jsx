import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SongList from "../components/SongList.jsx";
import emptyPlaylistIcon from '../../public/assets/icons/empty-playlist.png';
import { getAtrist } from "../services/userService.jsx";

const Album = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const songInAlbumId = query.get("songId");
    const albumId = query.get("albumId");
    const navigate = useNavigate(); 

    const [album, setAlbum] = useState({});
    const [artist, setArist] = useState({});
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                let response;
                if (songInAlbumId) {
                    response = await fetch(`https://localhost:7219/Album/song/${songInAlbumId}`);
                } else {
                    response = await fetch(`https://localhost:7219/Album/album/${albumId}`);
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data.data.data);
                setAlbum(data.data.data);
                setSongs(data.data.data.songs.$values);

                const artistResponse = await getAtrist(data.data.data.artistId);
                setArist(artistResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (albumId || songInAlbumId) {
            fetchPlaylist();
        }
    }, [albumId, songInAlbumId]);
    
    const handleGoToUserPage = () => {
        navigate(`/user?id=${artist.id}`); 
    };

    return (
        <div className="album-in-display-field">
            <div className="album-information">
                <div className="album-image">
                    <img 
                        id="album-image"
                        src={`https://localhost:7219/Album/photo/${album.id}`} 
                        alt={album.title} 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = emptyPlaylistIcon;
                        }}
                    />
                </div>
                <div className="album-details">
                    <div className="album-name" id="album-name">{album.title}</div>
                    <div className="album-date-shared" id="album-date-shared">{album.dateShared}</div>
                    <div className="albums-artist" id="album-artist">
                    <img
                        id="album-artist-image"
                        src={`https://localhost:7219/User/avatar/${artist.id}`}
                        alt={artist.username}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = require('../../public/assets/icons/noimageuser.png');
                        }}
                    />
                    <div className="atrist-username" onClick={handleGoToUserPage}>{artist.username}</div>                    
                    </div>
                </div>
            </div>
            <div id="songs-container" className="container-style">
                {songs.length > 0 && <SongList songs={songs} showArtist={false} showAlbum={false} />}
            </div>
        </div>
    );
}

export default Album;
