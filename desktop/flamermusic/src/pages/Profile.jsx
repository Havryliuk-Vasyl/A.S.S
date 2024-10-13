import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/profile.css";
import PlaylistCard from "../components/PlaylistCard.jsx";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [usersPlaylist, setUsersPlaylist] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        const checkToken = async () => {
            if (!token) {
                navigate('/auth');
                return;
            }
    
            try {
                const response = await fetch("https://localhost:7219/Authorization/validateToken", {
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
                console.log(userData.id);
                const response = await fetch(`https://localhost:7219/Playlist/${userData.id}`);
                
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
    
                const data = await response.json();
                console.log(data);
                setUsersPlaylist(data.data.$values);
            } catch (error) {
                console.error("Failed to fetch playlists:", error);
            }
        };
    
        getUsersPlaylists();
    }, [userData]);

    return (
        <div className="user-profile">
            <div className="profile-information">
                <div className="profile-photo">
                    <img className="profile-avatar" src={userData ? `https://localhost:7219/User/avatar/${userData.id}` : 'default-avatar-url'} alt="User Avatar"/>
                </div>
                <div className="user-info">
                    <div className="username" id="username">{userData?.username}</div>
                    <div className="name" id="name">{userData?.email}</div>
                    <div className="status">{userData?.status}</div>
                    <div className="date-joined">{userData?.dataJoined}</div>
                </div>
            </div>
            <div className="catalog-playlist">
                {usersPlaylist?.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </div>
    );
};

export default Profile;
