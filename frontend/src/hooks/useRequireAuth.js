import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Import the context

const UserRequireAuth = ({ children }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Access user from the context

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default UserRequireAuth;
