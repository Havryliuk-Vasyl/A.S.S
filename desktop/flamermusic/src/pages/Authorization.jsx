import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext.jsx';

const API_URL = "https://localhost:7219/";

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

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        if (!formData.email || !formData.password || (!isLoginForm && (!formData.username || !formData.name))) {
            alert('Будь ласка, заповніть усі поля');
            setTimeout(() => setFormData({ ...formData }), 0);
            return false;
        }
        if (!validateEmail(formData.email)) {
            alert('Введіть коректний email');
            setTimeout(() => setFormData({ ...formData }), 0);
            return false;
        }
        if (formData.password.length < 8) {
            alert('Пароль має бути не менше 8 символів');
            setTimeout(() => setFormData({ ...formData }), 0);
            return false;
        }
        return true;
    };
    

    const registrate = async () => {
        if (!validateForm()) {
            setFormData({ ...formData });
            return;
        }

        const user = {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch(`${API_URL}Authorization/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            console.log(response);
            if (response.ok) {
                toggleForm();
            } else if (response.status === false) {
                const error = await response.text();
                if (error.includes("already exists")) {
                    alert('User with this email alreade exists!');
                }
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const login = async () => {
        if (!validateForm()) {
            setFormData({ ...formData });
            return;
        }

        const userLogin = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch(`${API_URL}Authorization/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userLogin),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                localStorage.setItem('token', data.data.token);
                navigate('/');
            } else {
                console.error("Помилка під час входу:", response.statusText);
                alert('Невірний email або пароль');
            }
        } catch (error) {
            console.error("Помилка під час входу:", error);
        }
    };

    return (
        <div className="container">
            <div className="authorization">
                <h1>FlamerMusic</h1>
                <h2>{isLoginForm ? 'Логін' : 'Реєстрація'}</h2>
                {!isLoginForm ? (
                    <div id="registration">
                        <form id="registrationForm" onSubmit={(e) => e.preventDefault()}>
                            <input type="text" name="username" placeholder="Псевдонім користувача" value={formData.username} onChange={handleChange} required />
                            <input type="text" name="name" placeholder="Ім'я" value={formData.name} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
                            <input type="button" onClick={registrate} id="reg_button" value="Зареєструватися" />
                            <button type="button" onClick={toggleForm}>Увійти</button>
                        </form>
                    </div>
                ) : (
                    <div id="login">
                        <form id="loginForm" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
                            <input type="button" onClick={login} id="log_button" value="Увійти" />
                            <button type="button" onClick={toggleForm}>Зареєструватися</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Authorization;
