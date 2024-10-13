import React, { useState } from "react";

import '../styles/index.css'

const PlaylistCard = (playlist) => {
    return (
        <div className="playlist-card">
            <div className="playlist-card-image"><img src="" alt={playlist.name} /></div>
            <div className="playlist-card-name">{playlist.name}</div>
        </div>
    );
}