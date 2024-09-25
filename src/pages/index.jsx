import Header from '../components/header/header';
import school from "../assets/ai-generated-8663328_1280.png";
import { Link } from "react-router-dom";
import Footer from "../components/footer/footer";
import Card from "../components/card/card-teacher";
import CardCreateLessons from "../components/card/card-create-lessons";
import CardLessons from "../components/card/card-lessons";
import { getUserProfile } from '../services/user.service';
import "../style/index.css";
import React, { useState, useEffect } from 'react';

function Index() {
  
    const [closestTeacherId, setClosestTeacherId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        try {
          const data = await getUserProfile(token);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
        } catch (err) {
          setError(err.response ? err.response.data.message : err.message);
        }
      };
  
      fetchProfile();
    }, []);
  
    useEffect(() => {
      const fetchClosestTeacherId = async () => {
        if (latitude && longitude) { // latitude  longitude = null
          try {
            console.log(`Fetching closest teacher with lat: ${latitude} and lon: ${longitude}`);
            const response = await fetch(`http://localhost:3001/api/closest-teacher?lat=${latitude}&lon=${longitude}`);
            
            // Verify response
            if (!response.ok) {
              throw new Error('Erreur de réseau : ' + response.status);
            }
    
            const data = await response.json(); 
    
            if (data.teacher) {
              setClosestTeacherId(data.teacher.id); 
            } else {
              setErrorMessage('Aucun professeur trouvé à proximité');
            }
          } catch (error) {
            console.error('Erreur lors de la récupération de la localisation:', error);
            setErrorMessage(error.message || 'Erreur lors de la récupération de la localisation.');
          }
        }
      };
      
      fetchClosestTeacherId();
    }, [latitude, longitude]);

  return (
    <>
      <Header />
      <main>
        <div className="background-content">
          <img src={school} alt='professeur' />
          <div className='text'>
            <h1> Trouvez le professeur parfait pour vos cours de soutien scolaire</h1>
            <p> 🥇 les meilleurs enseignants en soutien scolaire</p>
            <p> 📈 suivez l'évolution de votre enfant à tous moment </p>
            <p> 👩‍🏫 cours adaptés à tous types d'élèves</p>
            <Link to="/Payment">
              <button className='button-payment'>Nos abonnements</button>
            </Link>
          </div>
        </div>
        <section className='content'>
          <p> Vous cherchez à améliorer vos résultats scolaires ou à renforcer vos compétences
             académiques ? Learn@Home est là pour vous aider à atteindre vos objectifs !
             Notre plateforme innovante met en relation des élèves motivés et des professeurs 
             qualifiés pour offrir un soutien personnalisé et adapté aux besoins de chacun.
          </p>
          <p>{latitude}</p>
        </section>
        <Link to={closestTeacherId ? `/user/${closestTeacherId}` : '#'} >
          <button className='button-localisation' disabled={!closestTeacherId}>
            {closestTeacherId ? 'Le professeur le plus proche de chez vous' : 'Recherche du professeur...'}
          </button>
        </Link>
        {error && <div className="error-message">{error}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <section>
          <h2>Nos Professeurs:</h2>
          <Card />
        </section>
        <section className='teacher-cards'>
          <h2>Nos cours:</h2>
          <CardCreateLessons /><CardLessons />
        </section>
        <section className='teacher-cards'>
          <h2>Nos exercices:</h2>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Index;