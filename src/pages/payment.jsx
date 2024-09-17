import React from 'react';
import Header from '../components/header/header';
import Footer from "../components/footer/footer"
import "../style/index.css";

function Offer() {
 
  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; 
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement", error);
    }
  };

  return (
  <>
        <Header />
        <main>
          <div className="background-content">
            <h1>
              Commencer dès maintenant en prenant notre abonnement, le meilleur professeur pour
              vous sera choisi grâce à notre algorithme
            </h1>
            <div className="card">
              <h2>Abonnement 30 jours !</h2>
              <p>- 4 séances de deux heures avec un professeur</p>
              <p>Accès à tous nos exercices</p>
              <p>Accès à tous nos cours</p>
              <p>Possibilité de cours en présentiel</p>
              <h3>199 EUR</h3>
              <button className="button-payment" onClick={handleCheckout}>
                Acheter
              </button>
            </div>
          </div>
        </main>
        <Footer/>
          </>
  );
}

export default Offer;
