import React, { useState } from "react";
import Modal from "react-modal";

import '../../styles/modal.css';

import { editTitle, changePhoto } from "../../services/playlistService.jsx";

const EditPlaylistModal = ({ isOpen, closeModal, playlistInformation }) => {
    const [newImage, setNewImage] = useState(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImage(event.target.files[0]);
        }
    };

    const handleSave = () => {
        if (playlistInformation?.playlist) {
            var newPhoto = {
                playlistId: playlistInformation.playlist.playlistId,
                photo: newImage
            };

            console.log(playlistInformation.playlist);
            editTitle(playlistInformation.playlist);
            changePhoto(newPhoto);
        } else {
            console.error('Playlist information is missing');
        }

        closeModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal"
        >
            <h2>Edit Playlist</h2>
            {React.cloneElement(playlistInformation, { onImageChange: handleImageChange })}
            <button onClick={handleSave} className='saveBtn'>Save</button>
            <button onClick={closeModal} className='cancelBtn'>Cancel</button>
        </Modal>
    );
};

export default EditPlaylistModal;
