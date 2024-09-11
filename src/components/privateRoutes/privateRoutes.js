import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';

const PrivateRoute = ({ element: Component }) => {
  const { token } = useAuth(); 
  return token ? Component : <Navigate to="/Login" />;
};

export default PrivateRoute;