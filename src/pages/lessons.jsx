import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getLessonsById, updateLesson } from '../services/lessons.service'; // Importer updateLesson
import { getUserProfile } from '../services/user.service'; 
import Footer from "../components/footer/footer";
import Header from '../components/header/header';

const LessonsDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [editMode, setEditMode] = useState(false); 
  const [formData, setFormData] = useState({ title: '', content: '' }); 


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await getUserProfile(token);
        if (data && data.id) {
          setUserId(data.id);
        } else {
          setError("Erreur lors de la récupération du profil utilisateur.");
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsById(id);
        setLesson(data); 
        setFormData({ title: data.title, content: data.content }); 
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [id]);
//formdata update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await updateLesson(id, formData, token); 
      setLesson({ ...lesson, ...formData }); // Update the lesson 
      setEditMode(false); // Exit edit mode
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const canEdit = lesson && lesson.id_creator == userId; 

  return (
    <>
      <Header />
      <div className="lessons-detail-container">
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              required
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Content"
              required
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <>
            {lesson ? (
              <>
                <h1>{lesson.title}</h1>
                <div>
                  <p>{lesson.content}</p>
                </div>
                <p>Créateur: {lesson.email_creator}</p>
                {canEdit && (
                  <button onClick={() => setEditMode(true)}>Modifier</button>
                )}
              </>
            ) : (
              <p>No lesson found.</p>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default LessonsDetail;