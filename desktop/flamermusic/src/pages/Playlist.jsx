import React, { useState } from "react";

import '../styles/playlist.css'

const Playlist = (userId) => {
    return (
        <div className="playlists">
            <div className="playlist-card-image"><img src="" alt={playlist.name} /></div>
            <div className="playlist-card-name">{playlist.name}</div>
        </div>
    );
}

export default Playlist;