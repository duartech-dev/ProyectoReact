import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ user, children }) => {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminProtectedRoute;