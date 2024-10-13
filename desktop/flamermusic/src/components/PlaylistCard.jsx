import React, { useState } from "react";

import '../styles/playlist.css';

const PlaylistCard = ({playlist}) => {
    return (
        <div className="playlist-card">
            <div className="playlist-card-image"><img src={`https://localhost:7219/Playlist/photo?playlistId=${playlist.id}`} alt={playlist.title} /></div>
            <div className="playlist-card-name">{playlist.title}</div>
        </div>
    );
}

export default PlaylistCard;