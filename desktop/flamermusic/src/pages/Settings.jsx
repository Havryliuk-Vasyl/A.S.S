import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

const Settings = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleOnClickExit = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode); // Зміна класу для темної теми
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <div className="settings">
            <h2>Settings</h2>
            <button onClick={handleOnClickExit}>Exit</button>
        </div>
    );
};

export default Settings;
