import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import "../styles/profile.css";
import SongList from "../components/SongList.jsx";
import PlaylistCard from "../components/PlaylistCard.jsx";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    
    const query = new URLSearchParams(location.search);
    const userId = query.get("id");
    const [usersPlaylist, setUsersPlaylist] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        try {
            const fetchUserData = async () => {
                const response = await fetch(`https://localhost:7219/User/id/${userId}`);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const data = await response.json();
                setUserData(data.data);
            };
            fetchUserData();
        }
        catch (Error){
            console.error("Failed to fetch user data:", error);
        }
    });

    useEffect(() => {
        const getUsersPlaylists = async () => {
            if (!userData) return;
            
            try {
                const response = await fetch(`https://localhost:7219/Playlist/${userData.id}`);
                
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
    
                const data = await response.json();
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
                    <img className="profile-avatar" src={`https://localhost:7219/User/avatar/${userData?.id}` || require('../../public/assets/icons/noimageuser.png')} alt="User Avatar"/>
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

export default UserProfile;
