import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Index from './pages/index';
import Login from './pages/login';
import Signin from './pages/signin';
import Payment from './pages/payment';
import { AuthProvider } from './components/auth/auth';
import PrivateRoute from './components/privateRoutes/privateRoutes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Index" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signin" element={<Signin />} />
          
          {/* Routes protégées */}
          <Route path="/Payment" element={<PrivateRoute element={<Payment />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);