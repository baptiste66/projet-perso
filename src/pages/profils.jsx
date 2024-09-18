import React, { useState, useEffect } from 'react';
import Header from '../components/header/header';
import '../style/index.css';
import { getUserProfile, updateUserProfile } from '../services/user.service';
import Footer from "../components/footer/footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [validationError, setValidationError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const data = await getUserProfile(token);
      setUser(data);
      setFormData({
        email: data.email || '',
        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
        address: data.address || '',
        educationLevel: data.educationLevel || '',
        profileImage: data.profileImage || '',
      });
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    //old value 
    const { name, value } = e.target;
    //new value
    setFormData({ ...formData, [name]: value });
  };
// base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result.split(',')[1] });
      };
      reader.readAsDataURL(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const { email, birthdate, educationLevel, profileImage } = formData;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Adresse email invalide';
    }
    if (!birthdate) {
      return 'Date de naissance manquante';
    }
    const birthdateObj = new Date(birthdate);
    const cutoffDate = new Date('2015-01-01');
    if (isNaN(birthdateObj.getTime()) || birthdateObj >= cutoffDate) {
      return 'La date de naissance doit être antérieure à 2015';
    }
    if (!educationLevel) {
      return "Niveau d'étude manquant";
    }
    if (!profileImage) {
      return 'Image de profil manquante';
    }

    return null;
  };

  const handleSaveChanges = async () => {
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }
  
    const token = localStorage.getItem('token');
    const updatedData = {
      email: formData.email,
      birthdate: formData.birthdate, 
      address: formData.address,
      educationLevel: formData.educationLevel,
      profileImage: formData.profileImage,
    };
  
    try {
      const updatedUser = await updateUserProfile(token, updatedData);
      setUser(updatedUser);
      setEditMode(false); // Exit if successful update
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

 
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <>
      <Header />
      <main>
        <span className='title'><h1>Mon Profil</h1></span>
        {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
        {user ? (
          <div className='info'>
            {selectedImage ? (
              <img className='pdp' src={selectedImage} alt="Aperçu de profil" />
            ) : (
              user.profileImage && (
                <img className='pdp' src={`data:image/jpeg;base64,${user.profileImage}`} alt="Profil" />
              )
            )}
            <span className='right'>
              {!editMode ? (
                <>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Date de naissance:</strong> {formatDate(user.birthdate)}</p>
                  <p><strong>Adresse:</strong> {user.address}</p>
                  <p><strong>Niveau d'étude:</strong> {user.educationLevel}</p>
                  <button onClick={() => setEditMode(true)}>Modifier</button>
                </>
              ) : (
                <>
                  <div>
                    <label>Email: </label>
                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label>Date de naissance: </label>
                    <input type="date" name="birthdate" value={formData.birthdate || ''} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label>Adresse: </label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label>Niveau d'étude: </label>
                    <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label>Modifier l'image de profil: </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                  <button onClick={handleSaveChanges}>Sauvegarder</button>
                  <button onClick={() => setEditMode(false)}>Annuler</button>
                </>
              )}
            </span>
          </div>
        ) : (
          <p>Pas d'informations disponibles.</p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Profile;
