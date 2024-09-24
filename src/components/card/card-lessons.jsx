import React, { useState, useEffect } from 'react';
import { getAllLessons } from '../../services/lessons.service'; // Correct the import path
import { Link } from 'react-router-dom';

const Cards = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessons(); // Correct the function name
        setLessons(data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLessons();
  }, []); // Add an empty dependency array

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="cards-container">
      {lessons.length === 0 ? (
        <p>Aucune leçon trouvée.</p> // Updated message to reflect lessons instead of users
      ) : (
        lessons.map((lesson) => ( 
          <Link to={`/lessons/${lesson.id}`} key={lesson.id} className="card-link">
            <div className="card">
            <div className="card-body">
                <h2>{lesson.title || 'Titre non disponible'}</h2> 
                <p>Matière: {lesson.category || 'Catégorie non disponible'}</p> 
               
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Cards;
