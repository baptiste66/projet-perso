import React, { useState } from 'react';
import Header from '../components/header/header';
import "../style/index.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Connexion réussie !');
           
        } else {
            setMessage(data.message || 'Une erreur est survenue.');
        }
    };

    return (
        <>
            <Header />
            <main>
                <div className="background-content">
                    <span className='title'><h1>Bienvenue !</h1></span>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Adresse e-mail :</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe :</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Connexion</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </main>
            <footer>
                <h3>Nos réseaux :</h3>
            </footer>
        </>
    );
}

export default Login;

  