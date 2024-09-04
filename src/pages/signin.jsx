import React, { useState } from 'react';
import Header from '../components/header/header';
import "../style/index.css"

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Inscription réussie !');
        } else {
            setMessage(data.message || 'Une erreur est survenue.');
        }
    };

    return (
        <html lang="fr">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Learn@Home</title>
                <link rel="stylesheet" href="../style/main.css" />
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                />
            </head>
            <body>
                <Header />
                <main>
                    <div className="background-content">
                        <h1>Bienvenue !</h1>
                        <form className="signin-form" onSubmit={handleSubmit}>
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

                            <button type="submit" className="signin-button">S'inscrire</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </main>
                <footer>
                    <h3>Nos réseaux :</h3>
                </footer>
            </body>
        </html>
    );
}

export default Signin;