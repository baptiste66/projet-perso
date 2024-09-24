import React, { useState } from 'react';

import { useAuth } from '../components/context/context';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header/header';
import Footer from "../components/footer/footer"
import "../style/index.css";

const Login = () => {
  // States for student
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // States for teacher
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e, userType) => {
    e.preventDefault();
    let email, password;
    if (userType === 'student') {
      email = studentEmail;
      password = studentPassword;
  } else if (userType === 'teacher') {
      email = teacherEmail;
      password = teacherPassword;
  }
    try {
      //connect
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // context
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
            
            {/* Form for Elèves */}
            <form className="login-form" onSubmit={(e) => handleLogin(e, 'student')}>
              <span className='title inline'><h2>Elèves</h2></span>
              <div className="form-group">
                <label htmlFor="studentEmail">Adresse e-mail :</label>
                <input
                  type="email"
                  id="studentEmail"
                  name="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentPassword">Mot de passe :</label>
                <input
                  type="password"
                  id="studentPassword"
                  name="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Connexion</button>
            </form>
            

            {/* Form for Professeurs */}
            <form className="login-form" onSubmit={(e) => handleLogin(e, 'teacher')}>
              <span className='title'><h2>Professeurs</h2></span>
              <div className="form-group">
                <label htmlFor="teacherEmail">Adresse e-mail :</label>
                <input
                  type="email"
                  id="teacherEmail"
                  name="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="teacherPassword">Mot de passe :</label>
                <input
                  type="password"
                  id="teacherPassword"
                  name="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Connexion</button>
            </form>
            
          </div> {message && <p>{message}</p>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default Login;
