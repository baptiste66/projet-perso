const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'learnhome',
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion :" + err.stack);
    return;
  }
  console.log("Connexion réussie à la base de données");
});

module.exports = connection;