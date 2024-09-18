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

module.exports = { updateUser };