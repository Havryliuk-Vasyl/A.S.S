import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/artist.css';

const API_URL = "https://localhost:7219/";

const ArtistAlbumCard = ({ album }) => {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/artist/album-edit?id=${album.id}`);
    }
    
    return (
        <div className="artist-album-card" onClick={handleOnClick}>
            <div className="artist-album-card-image">
                <img 
                    src={`${API_URL}Album/photo/${album.id}`} 
                    alt={album.title} 
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
                    }}
                />
            </div>
            <div className="artist-album-card-name">{album.title}</div>
        </div>
    );
}

export default ArtistAlbumCard;
