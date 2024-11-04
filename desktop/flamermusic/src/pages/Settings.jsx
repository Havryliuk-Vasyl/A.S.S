import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from '../context/UserContext.jsx';
import BecomeArtist from "../components/modals/BecomeArtistModal.jsx";

import "../styles/index.css";

const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUser();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navigate = useNavigate();

    const toggleExit = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const toggleBecomeArtist = () => {
        openModal();
    }

    return (
        <div className="settings">
            <h2>Settings</h2>
            <br/>
            <label>Account Settings</label>
            {user?.status === "listener" ? <button onClick={toggleBecomeArtist}>Become an artist</button> : ''}
            <br/>
            <label>System settings</label>
            <button onClick={toggleExit}>Exit</button>
            <BecomeArtist isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
};

export default Settings;
