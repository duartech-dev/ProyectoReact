import React from 'react';
import ProjectsPageRoutes from './ProjectsPageRoutes';

const ProjectsPage = () => {
  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Gestión de Proyectos</h2>
      <ProjectsPageRoutes />
    </div>
  );
};

export default ProjectsPage;
