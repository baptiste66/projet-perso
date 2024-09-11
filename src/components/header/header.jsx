import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // token?
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
    setIsLoggedIn(false);
  };

  return (
    <header>
      <nav className="main-nav">
        <div className="background-header">    
              <Link className="main-nav-item" to="/signin">
                <p>S'inscrire</p>
              </Link> <Link className="main-nav-item" to="/">
            <img src={logo} alt="logo"/>
          </Link>
          {isLoggedIn ? (
            <>
              <Link className="main-nav-item" to="/" onClick={handleLogout}>
                <p>Déconnexion</p>
              </Link>
            </>
          ) : (
            <>
              <Link className="main-nav-item" to="/login">
                <p>Connexion</p>
              </Link> 
         
            </>
          )}
         
        </div>
      </nav>
    </header>
  );
}