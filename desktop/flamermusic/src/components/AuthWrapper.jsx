import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import App from '../App.jsx';

import { useUser } from '../context/UserContext.jsx';

import '../styles/auth.css';

const API_URL = "https://localhost:7219/";

const AuthWrapper = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkToken = async () => {
      if (!token) {
        navigate('/auth');
        return;
      }
      try {
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
        const { id, username, email, status } = data;
        updateUser({ id, username, email, status });
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem('token');
        navigate('/auth');
      }
    };

    checkToken();
  }, [navigate]);
  
  return <App />;
};

export default AuthWrapper;
