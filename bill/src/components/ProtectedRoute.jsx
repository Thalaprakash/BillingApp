// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  // While loading or restoring user, show nothing (or a loader)
  if (user === undefined) return null;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
