import Header from '../components/header/header';
import "../style/index.css"
function Login() {
    return (
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Learn@Home</title>
          <link rel="stylesheet" href="../style/main.css" />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          />
        </head>
        <body>
        <Header />
            <main>
              <div className="background-content">
                <h1>Bienvenue !</h1>
                <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Adresse e-mail :</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe :</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className="login-button">Connexion</button>
            </form>
                </div>
          </main>
          <footer>
          <h3>Nos réseaux :</h3>
         </footer>
        </body>
      </html>
    );
  }
  
  export default Login;
  