import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getUserById } from '../services/user.service';
import Header from '../components/header/header';
import Footer from "../components/footer/footer";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        console.log('Données utilisateur:', data); 
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]); 
        } else {
          setError('Utilisateur non trouvé');
        }
      } catch (err) {
        console.error('Erreur de récupération utilisateur:', err); 
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return 'Date non disponible';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; 
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement", error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <>
      <Header />
      <main>
        <div className="user-detail">
          {user ? (
            <div>
              {user.profileImage && (
                <img className="pdp" src={`data:image/jpeg;base64,${user.profileImage}`} alt="Profil" />
              )}
              <h2>{user.name || 'Nom non disponible'}</h2>
              <p><strong>Email:</strong> {user.email || 'Email non disponible'}</p>
              <p><strong>Date de naissance:</strong> {formatDate(user.birthdate) || 'Date non disponible'}</p>
              <p><strong>Adresse:</strong> {user.address || 'Adresse non disponible'}</p>
              <p><strong>Niveau d'étude:</strong> {user.educationLevel || 'Niveau non disponible'}</p>
              <button className="button-payment" onClick={handleCheckout}>Prendre un cours</button>
            </div>
          ) : (
            <p>Utilisateur non trouvé.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserDetail;
