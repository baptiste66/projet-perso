import React, { useState } from 'react';
import Header from '../components/header/header';
import { useAuth } from '../components/context/context';
import { useNavigate } from 'react-router-dom';
import "../style/index.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e, type) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        //context
        login(data.token); 
        setMessage('Connexion réussie !');
        navigate('/index');
      } else {
        setMessage('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la connexion');
    }
  };
    return (
        <>
            <Header />
            <main>
                <div className="background-content">
                    <span className='title'><h1>Bienvenue !</h1></span> 
                    <div className='connection-types'>
                    
                    <form className="login-form" onSubmit={(e) =>handleLogin(e, 'user')}>
                      <span className='title inline'> <h2>Elèves</h2></span>
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
                
                
                     
                    <form className="login-form" onSubmit={(e) =>handleLogin(e, 'teacher')}> 
                      <span className='title'><h2>Professeurs</h2></span>
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
                </div>
            </main>
            <footer>
                <h3>Nos réseaux :</h3>
            </footer>
        </>
    );
}

export default Login;