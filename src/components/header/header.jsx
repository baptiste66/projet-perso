import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useAuth } from '../context/context'; 



export default function Header() {
  const { token, logout } = useAuth();
  const isLoggedIn = !!token; 

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };
  
  return (
    <header>
      <nav className="main-nav">
        <div className="background-header">
          <Link className="main-nav-item" to="/signin">
            <p>S'inscrire</p>
          </Link>
          <Link className="main-nav-item" to="/">
            <img src={logo} alt="logo"/>
          </Link>
                    {isLoggedIn ? (<Link className='main-nav-item' to="/profil">
                    <p>profil</p></Link>) : (<span className='none'><p></p></span>)}
          {isLoggedIn ? (
            <Link className="main-nav-item" to="/" onClick={handleLogout}>
              <p>Déconnexion</p>
            </Link>
          ) : (
            <Link className="main-nav-item" to="/login">
              <p>Connexion</p>
            </Link>
          )
          }

        </div>
      </nav>
    </header>
  );
}
