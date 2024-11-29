import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://localhost:7219/";

const EditAccounts = () => {
    const [users, setUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUsers(token);
        }
    }, []);

    const loadUsers = async (token) => {
        const response = await fetch(`${API_URL}Admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            setUsers(data.data || []);
        } else {
            console.error('Failed to load users');
        }
    };

    const handleGoToEditUser = (userId) => {
        navigate(`/admin/edit-user?id=${userId}`);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="users-list">
            <h2>Edit Accounts</h2>
            <div className="users-list-container">
                {users.length > 0 ? (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th onClick={() => handleSort('id')}>
                                    ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('username')}>
                                    Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('status')}>
                                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user) => (
                                <tr key={user.id} onClick={() => handleGoToEditUser(user.id)}>
                                    <td className="user-photo">
                                        <img 
                                            className="user-avatar" 
                                            src={`${API_URL}User/avatar/${user.id}`} 
                                            alt={user.username}
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = require('../../../public/assets/icons/noimageuser.png');
                                            }}
                                        />
                                    </td>
                                    <td className="user-id">{user.id}</td>
                                    <td className="user-username">{user.username}</td>
                                    <td className="user-status">{user.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default EditAccounts;
