import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAlbum, deleteAlbum } from "../../services/artistService.jsx";
import SongList from "../../components/SongList.jsx";

const API_URL = "https://localhost:7219/";

const ArtistAlbumEdit = () => {
    const location = useLocation();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [initialAlbum, setInitialAlbum] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const query = new URLSearchParams(location.search);
    const albumId = query.get("id");
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${API_URL}Album/album/${albumId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAlbum(data.data.data);
                setSongs(data.data.data.songs);
                setInitialAlbum(data.data.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchAlbum();
    }, [albumId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAlbum(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = async () => {
        await saveAlbum(album);
    };

    const handleDelete = async () => {
        deleteAlbum(album);
        navigate(0);
        navigate(-1);
    };

    const handleCancel = () => {
        setAlbum(initialAlbum);
        setIsEditing(false);
    };

    if (!album) return <div>Loading...</div>;

    return (
        <div className="artist-album">
            <div className="artist-album-div">
                <div className="artist-album-photo">
                    <img 
                        className="artist-album-avatar" 
                        src={`${API_URL}Album/photo/${album.id}`} 
                        alt={album.title}
                    />
                </div>
                <div className="artist-album-info">
                    <div className="artist-album-id">ID: {album.id}</div>
                    <div className="artist-album-username">
                        Title: 
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="title" 
                                value={album.title} 
                                onChange={handleInputChange} 
                            />
                        ) : (
                            " " + album.title
                        )}
                    </div>
                    <div className="artist-album-date-joined">Date joined: {album.dateShared}</div>
                </div>
                <div className="artist-album-control">
                    {isEditing ? (
                        <>
                            <div className="artist-album-control-save" onClick={handleSave}>Save</div>
                            <div className="artist-album-control-cancel" onClick={handleCancel}>Cancel</div>
                            <div className="artist-album-control-delete-user" onClick={handleDelete}>Delete</div>
                        </>
                    ) : (
                        <div className="artist-album-control-edit-user" onClick={handleEditClick}>Edit</div>
                    )}
                </div>
            </div>
            <div className="artist-album-songs">
                {songs.length > 0 && <SongList songs={songs} showArtist={false} showAlbum={false} isPlayable={false} />}
            </div>
        </div>
    );
};

export default ArtistAlbumEdit;