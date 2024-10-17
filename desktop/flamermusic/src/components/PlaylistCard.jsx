import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/playlist.css';

const PlaylistCard = ({playlist}) => {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/playlist?id=${playlist.id}`);
    }
    
    return (
        <div className="playlist-card" onClick={handleOnClick}>
            <div className="playlist-card-image">
            <img 
              src={`https://localhost:7219/Playlist/photo?playlistId=${playlist.id}`} 
              alt={playlist.title} 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
              }}
            />
            </div>
            <div className="playlist-card-name">{playlist.title}</div>
        </div>
    );
}

export default PlaylistCard;