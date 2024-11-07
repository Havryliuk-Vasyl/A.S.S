import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { addSongToPlaylist } from '../../services/playlistService.jsx';
import { useUser } from '../../context/UserContext.jsx';
import '../../styles/modal.css';

Modal.setAppElement('#root');

const API_URL = "https://localhost:7219/"

const AddSongToPlaylistModal = ({ isOpen, closeModal, song }) => {
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useState();
    const { user } = useUser();

    const handleAddSongToPlaylist = () => {
        if (user && user.id) {
            addSongToPlaylist(playlistId, song.id);
            closeModal();
        } else {
            console.error("User not found!");
        }
    };

    useEffect(() => {
        if (user && user.id) {
            const fetchPlaylists = async () => {
                try {
                    const response = await fetch(`${API_URL}Playlist/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch playlists');
                    }
                    const data = await response.json();
                    setPlaylists(data.data.$values);
                } catch (error) {
                    console.error('Failed to fetch playlists:', error);
                }
            };
            fetchPlaylists();
        }
    }, [user]);

    const handlePlaylistSelect = (event) => {
        setPlaylistId(event.target.value);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
            <h2>Add {song.title} to Playlist</h2>
            <select onChange={handlePlaylistSelect}>
                <option value="">Select Playlist</option>
                {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                        {playlist.title}
                    </option>
                ))}
            </select>
            <button onClick={handleAddSongToPlaylist} className='confirmBtn'>Add</button>
            <button onClick={closeModal} className='cancelBtn'>Cancel</button>
        </Modal>
    );
};

export default AddSongToPlaylistModal;
