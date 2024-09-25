import axios from 'axios';
const signup = async (email, password, birthdate, address, educationLevel, profileImage, userType, latitude, longitude) => {
 
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthdate', birthdate);
    formData.append('address', address);
    formData.append('educationLevel', educationLevel);
    formData.append('profileImage', profileImage);
    formData.append('userType', userType);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    console.log('Données envoyées:', {
      email,
      password,
      birthdate,
      address,
      educationLevel,
      userType,
      latitude,
      longitude
  });

  
    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
    return data;
  };
  export default signup

  export const getUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      throw err; 
    }
  };
  export const updateUserProfile = async (token, updatedData) => {
    try {
      const response = await axios.put('http://localhost:3001/api/profile', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };
  export const getAllUsers = async () => {
    const response = await axios.get(`http://localhost:3001/api/users_prof`); 
    return response.data;
  };
  export const getUserById = (id) => {
    return axios.get(`http://localhost:3001/api/users_prof`).then(res => res.data);
  };