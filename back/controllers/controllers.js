const connection = require('../connection/db');
const util = require('util');
//promesse
connection.query = util.promisify(connection.query);


const updateUser = async (userId, updateData) => {
  const { email, birthdate, address, educationLevel, profileImage } = updateData;
  
  const query = `
    UPDATE users
    SET email = ?, birthdate = ?, address = ?, educationLevel = ?, profileImage = ?
    WHERE id = ?
  `;
  const values = [email, birthdate, address, educationLevel, profileImage, userId];

  try {
    const results = await connection.query(query, values);
    return results;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
};

const getAllUsers = async (req, res) => {
  const { userType } = req.query; 

  let query = 'SELECT * FROM users';
  let values = [];

  if (userType) {
    query += ' WHERE userType = ?';
    values.push(userType);
  }

  try {
    const results = await connection.query(query, values);
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// Export des fonctions
module.exports = {
  getAllUsers,
  updateUser
};