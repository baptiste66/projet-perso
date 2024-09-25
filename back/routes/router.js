const express = require('express');
const { authenticateToken } = require('../middleware/aurhtoken');
const { getUserProfile } = require('../services/userService');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  connection  = require('../connection/db');
const router = express.Router();
const { updateUser, getAllUsers, getAllLessons, getAllTeachers }= require ('../controllers/controllers');


router.post('/signup', async (req, res) => {
  try {
    const { email, password, address, birthdate, educationLevel, userType, latitude, longitude } = req.body;
    const profileImage = req.files ? req.files.profileImage : null;
    
    // regex
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

    connection.query(`SELECT * FROM users WHERE email = ? AND userType = ?`, [email, userType], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: 'Utilisateur déjà existant avec cette email' });
      }

      // Hashage 
      const hashedPassword = await bcrypt.hash(password, 8);
      const profileImageBase64 = profileImage.data.toString('base64');

     

      // go to db
      connection.query(
        `INSERT INTO users (email, password, birthdate, address, educationLevel, profileImage, userType, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, birthdate, address, educationLevel, profileImageBase64, userType, latitude, longitude],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          //  token
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
 
  // where
  connection.query(`SELECT * FROM users WHERE email = ? AND userType = ?`, [email, userType], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Email ou type d\'utilisateur incorrect' });
    }

    const user = results[0];

    // decrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // token 
    const token = jwt.sign({ id: user.id, userType }, 'your_jwt_secret', { expiresIn: '24h' });
    res.status(200).json({ message: 'Connexion réussie', token });
  });
});

router.get('/profile', authenticateToken, getUserProfile);


router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Vous avez accès à cette route protégée!' });
});

//editprofile

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { email, birthdate, address, educationLevel, profileImage } = req.body;

    // regex
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

    const userType = req.user.userType; 

    // update
    const updatedUser = await updateUser(req.user.id, userType, { email, birthdate, address, educationLevel, profileImage });

    return res.status(200).json({ message: 'Profil mis à jour avec succès', updatedUser });
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// post lessons 
router.post('/lessons', (req, res) => {
  const { title, category, content, id_creator, email_creator } = req.body;

  // regex
  if (!title || !category || !content || !id_creator || !email_creator) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
  }

  // go to db
  const query = 'INSERT INTO lessons (title, category, content, id_creator, email_creator) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [title, category, content, id_creator, email_creator], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion dans la base de données:', err);
      return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création de la leçon.' });
    }
    res.status(201).json({ success: true, message: 'Leçon créée avec succès !', lessonId: results.insertId });
  });
});



router.get('/lessonsById/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM lessons WHERE id = ?'; 
  connection.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Erreur de récupération de la leçon.' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Leçon non trouvée.' });
      }
      res.status(200).json(results[0]); 
  });
});


//limiter mauvais id_creator
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


const findClosestTeacher = async (lat, lon) => {
  //const [users, setUsers] = useState([]);
  const teachers = await getAllTeachers(); 
 //const teachers = data.filter(user => user.userType === 'teacher');
 //setUsers(teachers);
  let closestTeacher = null;
  let closestDistance = Infinity;

  
  teachers.forEach(teacher => {
      const distance = calculateDistance(lat, lon, teacher.latitude, teacher.longitude); 
      if (distance < closestDistance) {
          closestDistance = distance;
          closestTeacher = teacher;
      }
  });

  
  return closestTeacher;
};

// calc 1 = user 2=teacher
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (Math.PI / 180) * value;

  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; //km
};

router.get('/closest-teacher', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude et longitude requises' });
  }

  try {
    const closestTeacher = await findClosestTeacher(lat, lon); 
    if (closestTeacher) {
      res.json({ teacher: closestTeacher });
    } else {
      res.status(404).json({ message: 'Aucun professeur trouvé à proximité' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche du professeur le plus proche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// all teacher
router.get('/users_prof', getAllUsers);

router.get('/lessons', getAllLessons);
module.exports = router;