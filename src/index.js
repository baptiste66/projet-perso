import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './index.css';
import Index from './pages/index';
import Login from './pages/login'
import Signin from './pages/signin';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
    <React.StrictMode>
        <Router basename="/">      
          <Routes>
            <Route exact path="/" element={<Index />} />
            <Route exact path="/Index" element={<Index />} />
            <Route exact path="/Login" element={<Login />} />
            <Route exact path="/Signin" element={<Signin />} />
          </Routes>
        </Router>
    </React.StrictMode>
);


