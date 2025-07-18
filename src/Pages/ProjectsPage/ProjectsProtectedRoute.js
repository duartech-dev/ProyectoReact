import React from 'react';
import { Navigate } from 'react-router-dom';

const ProjectsProtectedRoute = ({ userEmail, children }) => {
  if (!userEmail) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProjectsProtectedRoute;
