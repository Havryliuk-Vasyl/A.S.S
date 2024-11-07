import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveUser, deleteUser } from "../../services/adminService.jsx";

const API_URL = "https://localhost:7219/";

const EditUser = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [initialUser, setInitialUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const query = new URLSearchParams(location.search);
    const userId = query.get("id");
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}User/id/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUser(data.data);
                setInitialUser(data.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = async () => {
        await saveUser(user);
        navigate(0);
    };

    const handleDelete = async () => {
        deleteUser(user);
        navigate(-1);
    };

    const handleCancel = () => {
        setUser(initialUser);
        setIsEditing(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="user-account-div">
            <div className="user-account-photo">
                <img 
                    className="user-account-avatar" 
                    src={`${API_URL}User/avatar/${userId}`} 
                    alt="User avatar"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = require('../../../public/assets/icons/noimageuser.png');
                    }}
                />
            </div>
            <div className="user-account-info">
                <div className="user-account-id">ID: {user.id}</div>
                <div className="user-account-username">
                    Username: 
                    {isEditing ? (
                        <input 
                            type="text" 
                            name="username" 
                            value={user.username} 
                            onChange={handleInputChange} 
                        />
                    ) : (
                        " " + user.username
                    )}
                </div>
                <div className="user-account-name">
                    Name: 
                    {isEditing ? (
                        <input 
                            type="text" 
                            name="name" 
                            value={user.name} 
                            onChange={handleInputChange} 
                        />
                    ) : (
                        " " + user.name
                    )}
                </div>
                <div className="user-account-email">
                    Email: {user.email}
                </div>
                <div className="user-account-status">
                    Status: {user.status}
                </div>
                <div className="user-account-date-joined">Date joined: {user.dateJoined}</div>
            </div>
            <div className="user-control">
                {isEditing ? (
                    <>
                        <div className="user-control-save" onClick={handleSave}>Save</div>
                        <div className="user-control-cancel" onClick={handleCancel}>Cancel</div>
                        <div className="user-control-delete-user" onClick={handleDelete}>Delete</div>
                    </>
                ) : (
                    <div className="user-control-edit-user" onClick={handleEditClick}>Edit</div>
                )}
            </div>
            <div className="user-songs"></div>
        </div>
    );
};

export default EditUser;
