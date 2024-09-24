import Header from '../components/header/header';
import school from "../assets/ai-generated-8663328_1280.png";
import { Link } from "react-router-dom";
import Footer from "../components/footer/footer"
import Card from "../components/card/card-teacher"
import CardLessons from "../components/card/card- lessons"
import "../style/index.css"
function Index() {


    return (
        <>
          
        <Header />
            <main>
              <div className="background-content">
                <img src={school} alt='professeur'></img>
                <div className='text'>
                <h1> Trouvez le professeur parfait pour vos cours de soutien scolaire</h1>
                <p> 🥇 les meilleurs enseignants en soutien scolaire</p>
                <p> 📈 suivez l'évolution de votre enfant à tous moment </p>
                <p> 👩‍🏫 cour adapté adapté à tous types d'élèves</p>
                <Link to="/Payment">
                <button className='button-payment'>Nos abonnements</button></Link>
                </div>
                </div>
                <section className='content'>
                <p> Vous cherchez à améliorer vos résultats scolaires ou à renforcer vos compétences
                   académiques ? Learn@Home est là pour vous aider à atteindre vos objectifs !
                    Notre plateforme innovante met en relation des élèves motivés et des professeurs 
                    qualifiés pour offrir un soutien personnalisé et adapté aux besoins de chacun.</p>
                    </section>
                    <section className='teacher-cards'>
                    <h2>Nos Professeurs:</h2>
                    <Card/>
                    </section>
                    <section className='teacher-cards'>
                    <h2>Nos cours:</h2></section>
                    <CardLessons/>
                    <section className='teacher-cards'>
                    <h2>Nos exercices:</h2></section>
          </main>
         <Footer/>
        </>
    );
  }
  
  export default Index;
  