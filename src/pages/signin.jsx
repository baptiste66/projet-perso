import React, { useState } from 'react';
import Header from '../components/header/header';
import "../style/index.css";
import signup from '../services/user.service';
import { useAuth } from '../components/context/context';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/footer/footer"


function Signin() {
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [studentBirthdate, setStudentBirthdate] = useState('');
    const [studentAddress, setStudentAddress] = useState('');
    const [studentEducationLevel, setStudentEducationLevel] = useState('');
    const [studentProfileImage, setStudentProfileImage] = useState(null);
    
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [teacherBirthdate, setTeacherBirthdate] = useState('');
    const [teacherAddress, setTeacherAddress] = useState('');
    const [teacherEducationLevel, setTeacherEducationLevel] = useState('');
    const [teacherProfileImage, setTeacherProfileImage] = useState(null);

    const [studentLatitude, setStudentLatitude] = useState(null);
    const [studentLongitude, setStudentLongitude] = useState(null);
    const [teacherLatitude, setTeacherLatitude] = useState(null);
    const [teacherLongitude, setTeacherLongitude] = useState(null);
    
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate= useNavigate()
//base 64
    const handleImageChange = (e, setProfileImage) => {
        const file = e.target.files[0];
        if (file && file.size > 50 * 1024 * 1024) { // 50 MB
            setMessage('La taille de l\'image dépasse la limite autorisée de 50 Mo.');
            return;
        }
        setProfileImage(file); 
    };
//api pos
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.address) {
        const address = `${data.address.road || ''}, ${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''}, ${data.address.country || ''}`;
        return address;
      } else {
        console.log('Impossible de trouver une adresse.');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors du géocodage inversé:', error);
    }
  };
 //student pos
 const handleStudentGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoordinates(latitude, longitude);
        setStudentLatitude(latitude);
        setStudentLongitude(longitude);
        if (address) setStudentAddress(address);
      },
      (error) => {
        console.error('Erreur de géolocalisation :', error);
        setMessage('Erreur lors de l\'obtention de la localisation.');
      }
    );
};

const handleTeacherGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoordinates(latitude, longitude);
        setTeacherLatitude(latitude);
        setTeacherLongitude(longitude);
        if (address) setTeacherAddress(address);
      },
      (error) => {
        console.error('Erreur de géolocalisation :', error);
        setMessage('Erreur lors de l\'obtention de la localisation.');
      }
    );
};
       


    const handleSubmit = async (e, userType) => {
        e.preventDefault();
        let email, password, birthdate, address, educationLevel, profileImage,latitude, longitude ;
      
        // Set form data based on userType
        if (userType === 'student') {
          email = studentEmail;
          password = studentPassword;
          birthdate = studentBirthdate;
          address = studentAddress;
          educationLevel = studentEducationLevel;
          profileImage = studentProfileImage;
          latitude = studentLatitude;
          longitude = studentLongitude
        } else if (userType === 'teacher') {
          email = teacherEmail;
          password = teacherPassword;
          birthdate = teacherBirthdate;
          address = teacherAddress;
          educationLevel = teacherEducationLevel;
          profileImage = teacherProfileImage;
          latitude = teacherLatitude;
          longitude = teacherLongitude
        }
      
        // regex basic 
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setMessage('Adresse email invalide');
          return;
        }
        if (!password || password.length < 8) {
          setMessage('Le mot de passe doit contenir au moins 8 caractères');
          return;
        }
        if (!birthdate || new Date(birthdate) >= new Date('2015-01-01')) {
          setMessage('La date de naissance doit être antérieure à 2015');
          return;
        }
        if (!educationLevel) {
          setMessage("Niveau d'étude manquant");
          return;
        }
        if (!profileImage) {
          setMessage('Image de profil manquante');
          return;
        }
      
        try {
          const data = await signup(email, password, birthdate, address, educationLevel, profileImage, userType, latitude, longitude );
          if (data.token) {
            await login(data.token);
            console.log('Jeton stocké:', localStorage.getItem('token'));
            navigate('/index'); 
          } else {
            setMessage(data.message || 'Une erreur est survenue.');
          }
        } catch (error) {
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
                    <div className='connection-types'>
                        {/* Form for Elèves */}
                        <form className="signin-form" onSubmit={(e) => handleSubmit(e, 'student')}>
                            <span className='title inline'><h2>Elèves</h2></span>
                            <div className="form-group">
                                <label htmlFor="studentEmail">Adresse e-mail :</label>
                                <input 
                                    type="email" 
                                    id="studentEmail" 
                                    name="studentEmail" 
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
                                    name="studentPassword"
                                    value={studentPassword}
                                    onChange={(e) => setStudentPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="studentBirthdate">Date de naissance :</label>
                                <input 
                                    type="date" 
                                    id="studentBirthdate" 
                                    name="studentBirthdate" 
                                    value={studentBirthdate}
                                    onChange={(e) => setStudentBirthdate(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
  <label htmlFor="studentAddress">Adresse :</label>
  <input 
    type="text" 
    id="studentAddress" 
    name="studentAddress" 
    value={studentAddress}
    onChange={(e) => setStudentAddress(e.target.value)}
    required 
    readOnly // Empêche la modification manuelle
  />
  <button type="button" onClick={handleStudentGeolocation}>
    Obtenir ma localisation
  </button>
</div>
                            <div className="form-group">
                                <label htmlFor="studentEducationLevel">Niveau d'étude :</label>
                                <select 
                                    id="studentEducationLevel" 
                                    name="studentEducationLevel" 
                                    value={studentEducationLevel}
                                    onChange={(e) => setStudentEducationLevel(e.target.value)}
                                    required 
                                >
                                    <option value="">Sélectionnez votre classe</option>
                                    <option value="sixième">6ème</option>
                                    <option value="cinquième">5ème</option>
                                    <option value="quatrième">4ème</option>
                                    <option value="troisième">3ème</option>
                                    <option value="seconde">2nd</option>
                                    <option value="première">1ère</option>
                                    <option value="Terminal">Terminal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="studentProfileImage">Image de profil :</label>
                                <input 
                                    type="file" 
                                    id="studentProfileImage" 
                                    name="studentProfileImage"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setStudentProfileImage)}
                                />
                            </div>
                            <button type="submit" className="signin-button">S'inscrire</button>
                        </form>

                        {/* Form for Professeurs */}
                        <form className="signin-form" onSubmit={(e) => handleSubmit(e, 'teacher')}>
                            <span className='title inline'><h2>Professeurs</h2></span>
                            <div className="form-group">
                                <label htmlFor="teacherEmail">Adresse e-mail :</label>
                                <input 
                                    type="email" 
                                    id="teacherEmail" 
                                    name="teacherEmail" 
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
                                    name="teacherPassword"
                                    value={teacherPassword}
                                    onChange={(e) => setTeacherPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="teacherBirthdate">Date de naissance :</label>
                                <input 
                                    type="date" 
                                    id="teacherBirthdate" 
                                    name="teacherBirthdate" 
                                    value={teacherBirthdate}
                                    onChange={(e) => setTeacherBirthdate(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
  <label htmlFor="teacherAddress">Adresse :</label>
  <input 
    type="text" 
    id="teacherAddress" 
    name="teacherAddress" 
    value={teacherAddress}
    onChange={(e) => setTeacherAddress(e.target.value)}
    required 
    readOnly
  />
  <button type="button" onClick={handleTeacherGeolocation}>
    Obtenir ma localisation
  </button>
</div>
                            <div className="form-group">
                                <label htmlFor="teacherEducationLevel">Niveau d'étude :</label>
                                <select 
                                    id="teacherEducationLevel" 
                                    name="teacherEducationLevel" 
                                    value={teacherEducationLevel}
                                    onChange={(e) => setTeacherEducationLevel(e.target.value)}
                                    required 
                                >
                                    <option value="">Sélectionnez votre classe</option>
                                    <option value="sixième">6ème</option>
                                    <option value="cinquième">5ème</option>
                                    <option value="quatrième">4ème</option>
                                    <option value="troisième">3ème</option>
                                    <option value="seconde">2nd</option>
                                    <option value="première">1ère</option>
                                    <option value="Terminal">Terminal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="teacherProfileImage">Image de profil :</label>
                                <input 
                                    type="file" 
                                    id="teacherProfileImage" 
                                    name="teacherProfileImage"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setTeacherProfileImage)}
                                />
                            </div>
                            <button type="submit" className="signin-button">S'inscrire</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}

export default Signin;