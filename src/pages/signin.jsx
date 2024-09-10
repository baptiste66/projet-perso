import React, { useState } from 'react';
import Header from '../components/header/header';
import "../style/index.css";
import signup from '../services/user.service';

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file && file.size > 50 * 1024 * 1024) { // 50 MB
            setMessage('La taille de l\'image dépasse la limite autorisée de 50 Mo.');
            return;
        }
        
        setProfileImage(file); // Set the file object directly
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // signup = user.service
            const data = await signup(email, password, birthdate, address, educationLevel,profileImage);
            if (data.success) { 
                setMessage('Inscription réussie !');
            } else {
                setMessage(data.message || 'Une erreur est survenue.');
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setMessage('Une erreur est survenue.');
        }
    };

    return (
        <>
            <Header />
            <main>
                <div className="background-content">
                    <span className='title'><h1>Bienvenue !</h1></span>
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

                        <div className="form-group">
                            <label htmlFor="birthdate">Date de naissance :</label>
                            <span className='birthdate'><input 
                                type="date" 
                                id="birthdate" 
                                name="birthdate" 
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required 
                            /></span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Adresse :</label>
                            <input 
                                type="text" 
                                id="address" 
                                name="address" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="education-level">Niveau d'étude :</label>
                            <select 
                                id="education-level" 
                                name="education-level" 
                                value={educationLevel}
                                onChange={(e) => setEducationLevel(e.target.value)}
                                required 
                            >
                                <option value="">Sélectionnez votre classe</option>
                                <option value="6ème">6ème</option>
                                <option value="5ème">5ème</option>
                                <option value="4ème">4ème</option>
                                <option value="3ème">3ème</option>
                                <option value="2nd">2nd</option>
                                <option value="1ère">1ère</option>
                                <option value="Terminal">Terminal</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="profileImage">Image de profil :</label>
                            <input 
                                type="file" 
                                id="profileImage" 
                                name="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
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
        </>
    );
}

export default Signin;
