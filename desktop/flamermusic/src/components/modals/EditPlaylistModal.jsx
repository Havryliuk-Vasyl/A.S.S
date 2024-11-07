import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";

import '../../styles/modal.css';

import { editTitle, changePhoto } from "../../services/playlistService.jsx";

const API_URL = "https://localhost:7219/";

const EditPlaylistModal = ({ isOpen, closeModal, playlistToEdit, updatePlaylist }) => {
    const [newImage, setNewImage] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const playlistRef = useRef(playlistToEdit);

    useEffect(() => {
        if (playlistToEdit) {
            playlistRef.current = playlistToEdit;
            setNewTitle(playlistToEdit.playlistTitle || '');
        }
    }, [playlistToEdit]);

    const imageInputRef = useRef(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImage(event.target.files[0]);
        }
    };

    const handleTitleChange = (title) => {
        setNewTitle(title);
    };

    const handleSave = async () => {
        if (playlistRef.current) {
            const newTitleData = {
                playlistId: playlistRef.current.playlistId,
                playlistTitle: newTitle
            };

            await editTitle(newTitleData);

            if (newImage) {
                const formData = new FormData();
                formData.append("playlistId", playlistRef.current.playlistId);
                formData.append("photoFile", newImage);
                
                await changePhoto(formData);
            }

            updatePlaylist({ 
                ...playlistRef.current, 
                playlistTitle: newTitle, 
                photo: newImage ? URL.createObjectURL(newImage) : playlistRef.current.photo
            });
        } else {
            console.error('Playlist information is missing');
        }

        closeModal();
    };

    const triggerImageUpload = () => {
        imageInputRef.current.click();
    };

    const EditPlaylistInformation = () => (
        <div className="playlist-information">
            <div className="playlist-image" onClick={triggerImageUpload}>
                <img 
                    id="playlist-image"
                    src={newImage ? URL.createObjectURL(newImage) : `${API_URL}Playlist/photo?playlistId=${playlistRef.current.playlistId}`} 
                    alt={playlistRef.current.title} 
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = require('../../../public/assets/icons/empty-playlist.png'); 
                    }}
                />
                <input 
                    type="file" 
                    ref={imageInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleImageChange} 
                />
            </div>
            <input 
                type="text" 
                value={newTitle}
                onChange={(e) => handleTitleChange(e.target.value)} 
                className="playlist-name-input"
                autoFocus
            />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal"
        >
            <h2>Edit Playlist</h2>
            <EditPlaylistInformation/>
            <button onClick={handleSave} className='saveBtn'>Save</button>
            <button onClick={closeModal} className='cancelBtn'>Cancel</button>
        </Modal>
    );
};

export default EditPlaylistModal;
