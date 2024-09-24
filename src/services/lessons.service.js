import axios from 'axios';
export const createLesson = async (lessonData) => {
    const response = await fetch('http://localhost:3001/api/lessons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  };
  export const getAllLessons = async () => {
    const response = await axios.get(`http://localhost:3001/api/lessons`); 
    return response.data;
};

export const getLessonsById = (id) => {
    return axios.get(`http://localhost:3001/api/lessonsById/${id}`).then(res => res.data); // Include the ID in the URL
};