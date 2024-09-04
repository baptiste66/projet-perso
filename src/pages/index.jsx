import Header from '../components/header/header';
import school from "../assets/ai-generated-8663328_1280.png";
import "../style/index.css"
function Index() {
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
                <img src={school} alt='professeur'></img>
                <div className='text'>
                <h1> Trouvez le professeur parfait pour vos cours de soutien scolaire</h1>
                <p> 🥇 les meilleurs enseignants en soutien scolaire</p>
                <p> 📈 suivez l'évolution de votre enfant à tous moment </p>
                <p> 👩‍🏫 cour adapté adapté à tous types d'élèves</p>
                </div>
                </div>
                <section className='content'>
                <p> Vous cherchez à améliorer vos résultats scolaires ou à renforcer vos compétences
                   académiques ? Learn@Home est là pour vous aider à atteindre vos objectifs !
                    Notre plateforme innovante met en relation des élèves motivés et des professeurs 
                    qualifiés pour offrir un soutien personnalisé et adapté aux besoins de chacun.</p>
                    </section>
                    <h2>Nos Professeurs:</h2>
                    <h2>Nos cours:</h2>
                    <h2>Nos exercices:</h2>
          </main>
         <footer>
          <h3>Nos réseaux :</h3>
         </footer>
        </body>
      </html>
    );
  }
  
  export default Index;
  