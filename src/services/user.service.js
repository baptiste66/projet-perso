const signup = async (email, password, birthdate, address, educationLevel, profileImage) => {
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthdate', birthdate);
    formData.append('address', address);
    formData.append('educationLevel', educationLevel);
    formData.append('profileImage', profileImage);
  
    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();console.log('Réponse complète de l\'API:', data);
    return data;
  };
  export default signup