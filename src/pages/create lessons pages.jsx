import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLesson } from '../services/lessons.service';
import Header from '../components/header/header';
import Footer from "../components/footer/footer";
import { getUserProfile } from '../services/user.service';

const CreateLessons = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null); 
  const [userEmail, setUserEmail] = useState(null); 
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await getUserProfile(token);
        setUserId(data.id); 
        setUserEmail(data.email);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
      }
    };

    fetchProfile();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // regex
    if (!title || !category || !content || !userId || !userEmail) {
      setMessage('Tous les champs sont obligatoires.');
      return;
    }

    try {//service
      const response = await createLesson({ 
        title, 
        category, 
        content, 
        id_creator: userId, 
        email_creator: userEmail 
      });

      if (response.success) {
        setMessage('Leçon créée avec succès !');
        navigate('/index'); 
      } else {
        setMessage(response.message || 'Une erreur est survenue lors de la création de la leçon.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la leçon:', error);
      setMessage('Une erreur est survenue.');
    }
  };

  return (
    <>
      <Header />
      <div className="create-lessons-container">
        <h2>Créer une leçon</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Titre :</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="category">Catégorie :</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled hidden>Choisissez une catégorie</option>
              <option value="français">Français</option>
              <option value="mathématique">Mathématique</option>
              <option value="histoire">Histoire</option>
            </select>
          </div>
          <div>
            <label htmlFor="content">Contenu de la leçon :</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              required
            />
          </div>
          <button type="submit">Créer la leçon</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateLessons;
