import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";

import '../../styles/modal.css';
import { editUserProfile } from "../../services/userService.jsx";

const EditAccountModal = ({ isOpen, closeModal, userToEdit, updateUser }) => {
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newImage, setNewImage] = useState(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (userToEdit) {
            setNewName(userToEdit.name || '');
            setNewUsername(userToEdit.username || '');
        }
    }, [userToEdit]);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImage(event.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (userToEdit) {
            await editUserProfile(userToEdit.id, newUsername);
            updateUser({ ...userToEdit, username: newUsername });
        }
    
        closeModal();
    };

    const triggerImageUpload = () => {
        imageInputRef.current.click();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal"
        >
            <h2>Edit Profile</h2>
            <div className="profile-information">
                <div className="profile-photo">
                    <img
                        className="profile-avatar"
                        src={`https://localhost:7219/User/avatar/${userToEdit?.id}`}
                        alt={userToEdit?.username}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = require('../../../public/assets/icons/noimageuser.png');
                        }}
                    />
                </div>
                <div className="user-info">
                    <label>
                        Username:
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </label>
                </div>
            </div>
            <button onClick={handleSave} className="saveBtn">Save</button>
            <button onClick={closeModal} className="cancelBtn">Cancel</button>
        </Modal>
    );
};

export default EditAccountModal;
