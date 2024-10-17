import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext.jsx'; 

const Authorization = () => {
    const navigate = useNavigate();
    const { updateUser } = useUser();
    const [isLoginForm, setIsLoginForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
    });

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
        setFormData({ username: '', name: '', email: '', password: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const registrate = async () => {
        const user = {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch("https://localhost:7219/Authorization/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                toggleForm();
            } else if (response.status === 409) {
                const error = await response.text();
                if (error.includes("already exists")) {
                    alert('User with this email already exists');
                }
            } else {
                console.error("Error while sending data:", response.statusText);
            }
        } catch (error) {
            console.error("Error while sending data:", error);
        }
    };

    const login = async () => {
        const userLogin = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch("https://localhost:7219/Authorization/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userLogin),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.data.token);
                navigate('/');
            } else {
                console.error("Error while logging in:", response.statusText);
                alert('Incorrect email or password');
            }
        } catch (error) {
            console.error("Error while logging in:", error);
        }
    };

    return (
        <div className="container">
            <h1>FlamerMusic</h1>
            <h2>{isLoginForm ? 'Логін' : 'Реєстрація'}</h2>
            {!isLoginForm ? (
                <div id="registration">
                    <form id="registrationForm" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="username" placeholder="Псевдонім користувача" value={formData.username} onChange={handleChange} required />
                        <input type="text" name="name" placeholder="Ім'я" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
                        <input type="button" onClick={registrate} value="Зареєструватися" />
                        <button type="button" onClick={toggleForm}>Увійти</button>
                    </form>
                </div>
            ) : (
                <div id="login">
                    <form id="loginForm" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
                        <input type="button" onClick={login} value="Увійти" />
                        <button type="button" onClick={toggleForm}>Зареєструватися</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Authorization;
