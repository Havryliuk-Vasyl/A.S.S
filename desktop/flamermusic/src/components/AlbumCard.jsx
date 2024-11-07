import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/album.css';

const API_URL = "https://localhost:7219/";

const AlbumCard = ({album}) => {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/album?albumId=${album.id}`);
    }
    
    return (
        <div className="album-card" onClick={handleOnClick}>
            <div className="album-card-image">
            <img 
              src={`${API_URL}Album/photo/${album.id}`} 
              alt={album.title} 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
              }}
            />
            </div>
            <div className="album-card-name">{album.title}</div>
        </div>
    );
}

export default AlbumCard;