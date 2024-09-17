import React, { useState, useEffect } from 'react';
import Header from '../components/header/header';
import '../style/index.css';
import { getUserProfile } from '../services/user.service';
import Footer from "../components/footer/footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token);
        setUser(data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <>
      <Header />
      <main>
        <span className='title'><h1>Mon Profil</h1></span>
        {user ? (
          <div className='info'>
            {user.profileImage && (
              <span className='left'>
                <h4>Image de Profil :</h4>
                <img className='pdp' src={`data:image/jpeg;base64,${user.profileImage}`} alt="Profil" />
              </span>
            )}
            <span className='right'>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Date de naissance:</strong> {user.birthdate}</p>
              <p><strong>Adresse:</strong> {user.address}</p>
              <p><strong>Niveau d'étude:</strong> {user.educationLevel}</p>
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
