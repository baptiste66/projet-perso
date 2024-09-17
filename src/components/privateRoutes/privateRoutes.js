import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/context';

const PrivateRoute = ({ element }) => {
  const { token } = useAuth(); 
  return token ? element : <Navigate to="/Login" />;
};

export default PrivateRoute;