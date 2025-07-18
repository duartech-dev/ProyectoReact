import React from 'react';

const ProjectsList = ({ projects, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
            <tr key={proj.id}>
              <td>{proj.nombre}</td>
              <td>{proj.tipo}</td>
              <td>{proj.descripcion}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(proj)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(proj.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsList;
