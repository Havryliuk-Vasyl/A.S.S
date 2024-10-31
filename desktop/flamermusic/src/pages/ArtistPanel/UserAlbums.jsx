import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ArtistAlbumCard from '../../components/ArtistAlbumCard.jsx';
import '../../styles/artist.css';

const UserAlbums = () => {
    const [albums, setAlbums] = useState([]);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const userId = query.get("id");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const getUsersAlbums = async () => {
            try {
                const response = await fetch(`https://localhost:7219/Album/artist/${userId}`);
 
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
 
                const data = await response.json();
                setAlbums(data.data.$values || []);
            } catch (error) {
                console.error("Failed to fetch albums:", error);
            }
        };

        getUsersAlbums();
    }, [userId]);

    return (
        <div className="artist-catalog-album">
            <h2>All Albums</h2>
            <div className="artist-in-display-field">
                {albums.length > 0 ? (
                    albums.map((album) => (
                        <ArtistAlbumCard key={album.id} album={album}/>
                    ))
                ) : (
                    <p>No albums found.</p>
                )}
            </div>
        </div>
    );
};

export default UserAlbums;
