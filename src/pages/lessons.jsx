import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonsById } from '../services/lessons.service'; 
import Footer from "../components/footer/footer"
import Header from '../components/header/header';
const LessonsDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsById(id);
        setLesson(data); // Directly set the lesson
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <><Header/>
    <div className="lessons-detail-container">
      {lesson ? (
        <>
          <h1>{lesson.title}</h1>
          <div>
            <p>{lesson.content}</p>
          </div>
        </>
      ) : (
        <p>No lesson found.</p>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default LessonsDetail;