import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/user.service'; 
import { Link } from 'react-router-dom';

const Cards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  });

  const formatDate = (date) => {
    if (!date) return 'Date non disponible';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="cards-container">
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        users.map((user) => (
          <Link to={`/user/${user.id}`} key={user.id} className="card-link">
            <div className="card">
              {user.profileImage && (
                <img className="card-img" src={`data:image/jpeg;base64,${user.profileImage}`} alt="Profil" />
              )}
              <div className="card-body">
                <h2>{user.name || 'Nom non disponible'}</h2>
                <p><strong>Email:</strong> {user.email || 'Email non disponible'}</p>
                <p><strong>Date de naissance:</strong> {formatDate(user.birthdate) || 'Date non disponible'}</p>
                <p><strong>Adresse:</strong> {user.address || 'Adresse non disponible'}</p>
                <p><strong>Niveau d'étude:</strong> {user.educationLevel || 'Niveau non disponible'}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );}

export default Cards;
