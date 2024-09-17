const { connection } = require('../index');

const getUserProfile = (req, res) => {
  console.log('Route profil atteinte');

  const userId = req.user.id;
  const userType = req.user.userType;  // Assure-toi que userType est inclus dans le payload du token

  // Détermine la table à utiliser
  const tableName = userType === 'teacher' ? 'users_prof' : 'users';

  // Effectue la requête dans la table appropriée
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