import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './index.css';
import Index from './pages/index';
import SignIn from './pages/signin'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
    <React.StrictMode>
        <Router basename="/">      
          <Routes>
            <Route exact path="/" element={<Index />} />
            <Route exact path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
    </React.StrictMode>
);


