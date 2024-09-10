async function signup(email, password, birthdate, address, educationLevel, profileImage) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthdate', birthdate);
    formData.append('address', address);
    formData.append('educationLevel', educationLevel);
    if (profileImage) {
        formData.append('profileImage', profileImage);
    }

    const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        body: formData,
    });

    return response.json();
}

export default signup;
