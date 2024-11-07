import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import '../../styles/modal.css';
import { editUserProfile, changeUserAvatar } from "../../services/userService.jsx";

const API_URL = "https://localhost:7219/";

const EditAccountModal = ({ isOpen, closeModal, userToEdit, updateUser }) => {
    const [newImage, setNewImage] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const userRef = useRef(userToEdit);
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (userToEdit) {
            userRef.current = userToEdit;
            setNewUsername(userToEdit.username || '');
        }
    }, [userToEdit]);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImage(event.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (userRef.current) {
            const updatedData = { userId: userRef.current.id, username: newUsername };

            await editUserProfile(updatedData);

            if (newImage) {
                const formData = new FormData();
                formData.append("userId", userRef.current.id);
                formData.append("avatarFile", newImage);
                
                await changeUserAvatar(formData, userRef.current.id);
            }

            updateUser({ 
                ...userRef.current, 
                username: newUsername, 
                avatar: newImage ? URL.createObjectURL(newImage) : userRef.current.avatar 
            });
        } else {
            console.error('User information is missing');
        }

        closeModal();
    };

    const triggerImageUpload = () => {
        imageInputRef.current.click();
    };

    if (!userToEdit) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal"
        >
            <h2>Edit Profile</h2>
            <div className="profile-information">
                <div className="profile-photo" onClick={triggerImageUpload}>
                    <img
                        className="profile-avatar"
                        src={newImage ? URL.createObjectURL(newImage) : `${API_URL}User/avatar/${userRef.current.id}`}
                        alt={userRef.current.username}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = require('../../../public/assets/icons/noimageuser.png');
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
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="username-input"
                    autoFocus
                />
            </div>
            <button onClick={handleSave} className="saveBtn">Save</button>
            <button onClick={closeModal} className="cancelBtn">Cancel</button>
        </Modal>
    );
};

export default EditAccountModal;
