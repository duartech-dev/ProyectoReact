import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsMenu = () => {
  const navigate = useNavigate();
  return (
    <li className="nav-item dropdown">
      <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Proyectos
      </span>
      <ul className="dropdown-menu">
        <li>
          <span className="dropdown-item" style={{cursor:'pointer'}} onClick={() => navigate('/proyectos/crear')}>
            Crear registro
          </span>
        </li>
        <li>
          <span className="dropdown-item" style={{cursor:'pointer'}} onClick={() => navigate('/proyectos/listar')}>
            Listar registros
          </span>
        </li>
      </ul>
    </li>
  );
};

export default ProjectsMenu;
