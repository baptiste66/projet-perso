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



export const updateLesson = async (id, lessonData, token) => {
  try {
      // Effectuer une requête PUT pour mettre à jour la leçon, en incluant l'ID dans l'URL
      const response = await axios.put(`http://localhost:3001/api/editLessons/${id}`, lessonData, {
          headers: {
              Authorization: token, // Inclure le token d'autorisation dans les en-têtes
          },
      });
      // Retourner les données de la réponse si la mise à jour est réussie
      return response.data;
  } catch (error) {
      // Relancer l'erreur pour que l'appelant puisse la gérer
      throw error; 
  }
};



  export const getAllLessons = async () => {
    const response = await axios.get(`http://localhost:3001/api/lessons`); 
    return response.data;
};

export const getLessonsById = (id) => {
    return axios.get(`http://localhost:3001/api/lessonsById/${id}`).then(res => res.data); // Include the ID in the URL
};