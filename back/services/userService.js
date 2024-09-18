
const  connection  = require('../connection/db');

const getUserProfile = (req, res) => {
  const userId = req.user.id;
  const userType = req.user.userType;  
  const tableName = userType === 'teacher' ? 'users_prof' : 'users';

  connection.query('SELECT * FROM ?? WHERE id = ?', [tableName, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Profil utilisateur non trouvé' });
    }
    res.json(results[0]);
  });
};

module.exports = { getUserProfile };