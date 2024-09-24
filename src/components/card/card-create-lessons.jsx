import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';


const Cards = () => {


  return (
    <div className="cards-container">
      
        <Link className="card-link" to="/CreateLessons"> 
          <div className="card">
            <div className="card-body">
              <p><strong>+</strong></p>
            </div>
          </div>
        </Link>
      
    </div>
  );
}

export default Cards;