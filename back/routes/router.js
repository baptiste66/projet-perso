const express = require('express');
const { authenticateToken } = require('../middleware/aurhtoken');
const { getUserProfile } = require('../services/userService');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  connection  = require('../connection/db');
const router = express.Router();


// Sign-up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, address, birthdate, educationLevel, userType } = req.body;
    const profileImage = req.files ? req.files.profileImage : null;

    // Validations
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

    // Déterminer la table à utiliser en fonction de userType
    const tableName = userType === 'student' ? 'users' : 'users_prof';

    // Vérifier si l'utilisateur existe déjà dans la table appropriée
    connection.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: 'Utilisateur déjà existant' });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 8);
      // Convertir l'image en base64
      const profileImageBase64 = profileImage.data.toString('base64');

      // Insertion dans la base de données
      connection.query(
        `INSERT INTO ${tableName} (email, password, birthdate, address, educationLevel, profileImage) VALUES (?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, birthdate, address, educationLevel, profileImageBase64],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Générer un token après l'inscription
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

  const table = userType === 'teacher' ? 'users_prof' : 'users';

  connection.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, userType }, 'your_jwt_secret', { expiresIn: '24h' });
    res.status(200).json({ message: 'Connexion réussie', token });
  });
});

// Route protégée pour obtenir le profil utilisateur
router.get('/profile', authenticateToken, getUserProfile);

// Route protégée pour les paiements
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Vous avez accès à cette route protégée!' });
});

module.exports = router;