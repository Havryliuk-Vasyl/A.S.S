import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/album.css';

const API_URL = "https://localhost:7219/";

const UserCard = ({user}) => {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/user?id=${user.id}`);
    }
    
    return (
        <div className="album-card" onClick={handleOnClick}>
            <div className="album-card-image">
            <img 
              src={`${API_URL}User/avatar/${user.id}`} 
              alt={user.name} 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = require('../../public/assets/icons/empty-playlist.png'); 
              }}
            />
            </div>
            <div className="album-card-name">{user.title}</div>
        </div>
    );
}

export default UserCard;