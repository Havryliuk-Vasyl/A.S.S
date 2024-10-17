import React, { useState } from "react";
import Modal from "react-modal";

import '../../styles/modal.css';

const EditPlaylistModal = ({ isOpen, closeModal, playlist }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal"
        >
            <h2>Edit Playlist</h2>
            <p>Coming soon...</p>
            <button onClick={closeModal} className='cancelBtn'>Cancel</button>
        </Modal>
    );
};

export default EditPlaylistModal;