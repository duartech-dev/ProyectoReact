import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProjectsForm from './ProjectsForm';
import ProjectsList from './ProjectsList';
import { createProject, getProjects, updateProject, deleteProject } from './ProjectsService';

const ProjectsPageRoutes = () => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (data) => {
    if (editing && editData) {
      await updateProject(editData.id, data);
      setEditing(false);
      setEditData(null);
    } else {
      await createProject(data);
    }
    fetchProjects();
    navigate('/proyectos/listar');
  };

  const handleEdit = (project) => {
    setEditing(true);
    setEditData(project);
    navigate('/proyectos/crear');
  };

  const handleDelete = async (id) => {
    await deleteProject(id);
    fetchProjects();
  };

  return (
    <Routes>
      <Route path="crear" element={<ProjectsForm onSubmit={handleCreate} editing={editing} initialData={editData} />} />
      <Route path="listar" element={<ProjectsList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />} />
      <Route path="*" element={<ProjectsList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />} />
    </Routes>
  );
};

export default ProjectsPageRoutes;
