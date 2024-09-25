const express = require('express');
const { authenticateToken } = require('../middleware/aurhtoken');
const { getUserProfile } = require('../services/userService');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  connection  = require('../connection/db');
const router = express.Router();
const { updateUser, getAllUsers, getAllLessons }= require ('../controllers/controllers');


router.post('/signup', async (req, res) => {
  try {
    const { email, password, address, birthdate, educationLevel, userType, latitude, longitude } = req.body;
    const profileImage = req.files ? req.files.profileImage : null;
    
    // Validation des champs
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Adresse email invalide' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }
    if (!birthdate) {
      return res.status(400).json({ message: 'Date de naissance manquante' });
    }
    const birthdateObj = new Date(birthdate);
    const cutoffDate = new Date('2015-01-01');
    if (isNaN(birthdateObj.getTime()) || birthdateObj >= cutoffDate) {
      return res.status(400).json({ message: 'La date de naissance doit être antérieure à 2015' });
    }
    if (!educationLevel) {
      return res.status(400).json({ message: "Niveau d'étude manquant" });
    }
    if (!profileImage) {
      return res.status(400).json({ message: 'Image de profil manquante' });
    }

    // Vérification de l'existence de l'utilisateur avec le même email et userType
    connection.query(`SELECT * FROM users WHERE email = ? AND userType = ?`, [email, userType], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: 'Utilisateur déjà existant avec ce type' });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 8);
      const profileImageBase64 = profileImage.data.toString('base64');

     

      // Insertion dans la table `users` avec `userType`
      connection.query(
        `INSERT INTO users (email, password, birthdate, address, educationLevel, profileImage, userType, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, birthdate, address, educationLevel, profileImageBase64, userType, latitude, longitude],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Génération du token
          const token = jwt.sign({ id: result.insertId, userType }, 'your_jwt_secret', { expiresIn: '24h' });
          res.status(201).json({ message: 'Utilisateur créé avec succès', token });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});


// Login
router.post('/login', (req, res) => {
  const { email, password, userType } = req.body;
 
  // Recherche de l'utilisateur dans la table `users`
  connection.query(`SELECT * FROM users WHERE email = ? AND userType = ?`, [email, userType], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Email ou type d\'utilisateur incorrect' });
    }

    const user = results[0];

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, userType }, 'your_jwt_secret', { expiresIn: '24h' });
    res.status(200).json({ message: 'Connexion réussie', token });
  });
});

router.get('/profile', authenticateToken, getUserProfile);


router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Vous avez accès à cette route protégée!' });
});

//modificate profile

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { email, birthdate, address, educationLevel, profileImage } = req.body;

    // Validation des champs
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Adresse email invalide' });
    }
    if (!birthdate) {
      return res.status(400).json({ message: 'Date de naissance manquante' });
    }
    const birthdateObj = new Date(birthdate);
    const cutoffDate = new Date('2015-01-01');
    if (isNaN(birthdateObj.getTime()) || birthdateObj >= cutoffDate) {
      return res.status(400).json({ message: 'La date de naissance doit être antérieure à 2015' });
    }
    if (!educationLevel) {
      return res.status(400).json({ message: "Niveau d'étude manquant" });
    }

    // Récupérer le type d'utilisateur à partir du token
    const userType = req.user.userType; 

    // Mise à jour de l'utilisateur
    const updatedUser = await updateUser(req.user.id, userType, { email, birthdate, address, educationLevel, profileImage });

    return res.status(200).json({ message: 'Profil mis à jour avec succès', updatedUser });
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Exemple de route pour créer une leçon dans Express.js
router.post('/lessons', (req, res) => {
  const { title, category, content, id_creator, email_creator } = req.body;

  // Validation des données entrantes
  if (!title || !category || !content || !id_creator || !email_creator) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
  }

  // Requête SQL pour insérer une nouvelle leçon
  const query = 'INSERT INTO lessons (title, category, content, id_creator, email_creator) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [title, category, content, id_creator, email_creator], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion dans la base de données:', err);
      return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création de la leçon.' });
    }

    // Réponse de succès
    res.status(201).json({ success: true, message: 'Leçon créée avec succès !', lessonId: results.insertId });
  });
});



router.get('/lessonsById/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM lessons WHERE id = ?'; // Adapter selon ta base de données
  connection.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Erreur de récupération de la leçon.' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Leçon non trouvée.' });
      }
      res.status(200).json(results[0]); // Retourner la leçon
  });
});

router.put('/editLessons/:id', async (req, res) => {
  const { id } = req.params; 
  const { title, content } = req.body; 

  try {
      const query = 'UPDATE lessons SET title = ?, content = ? WHERE id = ?';
      connection.query(query, [title, content, id], (err, results) => {
          if (err) {
              return res.status(500).json({ message: 'Erreur lors de la mise à jour de la leçon.' });
          }
          if (results.affectedRows === 0) {
              return res.status(404).json({ message: 'Leçon non trouvée.' });
          }
          res.status(200).json({ message: 'Leçon mise à jour avec succès.' });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur du serveur', error });
  }
});

// all teacher
router.get('/users_prof', getAllUsers);

router.get('/lessons', getAllLessons);
module.exports = router;