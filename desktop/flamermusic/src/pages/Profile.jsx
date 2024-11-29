import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/profile.css";
import PlaylistCard from "../components/PlaylistCard.jsx";
import EditAccountModal from "../components/modals/EditAccountModal.jsx";

const API_URL = "https://localhost:7219/";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [usersPlaylist, setUsersPlaylist] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const updateUserInfo = (updatedUser) => {
        setUserData(updatedUser);
        navigate(0);
    };

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch(`${API_URL}Authorization/validateToken`, {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${token}`
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Invalid token');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Token validation failed:", error);
                localStorage.removeItem('token');
                navigate('/auth');
            }
        };

        checkToken();
    }, [navigate]);

    useEffect(() => {
        const getUsersPlaylists = async () => {
            if (!userData) return;
            
            try {
                const response = await fetch(`${API_URL}Playlist/${userData.id}`);
                
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
    
                const data = await response.json();
                console.log(data.data);
                setUsersPlaylist(data.data);
            } catch (error) {
                console.error("Failed to fetch playlists:", error);
            }
        };
    
        getUsersPlaylists();
    }, [userData]);

    return (
        <div className="user-profile">
            <div className="profile-information" onClick={openModal}>
                <div className="profile-photo">
                    <img 
                        id="playlist-image"
                        className="profile-avatar"
                        src={`${API_URL}User/avatar/${userData?.id}`} 
                        alt={userData?.username} 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = require('../../public/assets/icons/noimageuser.png'); 
                        }}
                    />
                </div>
                <div className="user-info">
                    <div className="username" id="username">{userData?.username}</div>
                    <div className="email" id="email">{userData?.email}</div>
                    <div className="status">{userData?.status}</div>
                    <div className="date-joined">{userData?.dateJoined}</div>
                </div>
            </div>
            <div className="catalog-playlist">
                {usersPlaylist.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </div>
            {userData && (
                <EditAccountModal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    userToEdit={userData}
                    updateUser={updateUserInfo}
                />
            )}
        </div>
    );
};

export default Profile;