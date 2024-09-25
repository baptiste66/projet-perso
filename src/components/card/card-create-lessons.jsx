import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../../services/user.service';

const Cards = () => {
  const [user, setUser] = useState(null); 
  const [userType, setUserType] = useState(null); 

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await getUserProfile(token);
        setUser(data); 
        setUserType(data.userType); 
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
       
      }
    };

    fetchProfile();
  }, []); 

  if (!user) {
    return null; 
  }

  

  return (
    <div className="cards-container">
      {userType === 'teacher' && ( 
        <Link className="card-link" to="/CreateLessons">
          <div className="card">
            <div className="card-body">
              <p>
                <strong>+</strong>
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Cards;