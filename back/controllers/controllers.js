const connection = require('../connection/db');

const updateUser = (userId, userType, updateData) => {
  return new Promise((resolve, reject) => {
    const { email, birthdate, address, educationLevel, profileImage } = updateData;
    const tableName = userType === 'student' ? 'users' : 'users_prof';

    const query = `
      UPDATE ${tableName}
      SET email = ?, birthdate = ?, address = ?, educationLevel = ?, profileImage = ?
      WHERE id = ?
    `;
    const values = [email, birthdate, address, educationLevel, profileImage, userId];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


const getAllUsers = (req, res) => {
  console.log("Fetching all users...");
  const query = 'SELECT * FROM users_prof';

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
    res.json(results);
  });
};
module.exports = {
  getAllUsers,updateUser
};

