import axios from 'axios';
export const createLesson = async ({ title, category, content, id_creator, email_creator }) => {
  const response = await fetch('http://localhost:3001/api/lessons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, category, content, id_creator, email_creator }),
  });

  return response.json();
};

  export const getAllLessons = async () => {
    const response = await axios.get(`http://localhost:3001/api/lessons`); 
    return response.data;
};

export const getLessonsById = (id) => {
    return axios.get(`http://localhost:3001/api/lessonsById/${id}`).then(res => res.data); // Include the ID in the URL
};