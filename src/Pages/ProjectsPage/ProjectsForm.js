import React, { useState } from 'react';

const initialState = {
  nombre: '',
  tipo: '',
  descripcion: '',
};

const ProjectsForm = ({ onSubmit, editing, initialData }) => {
  const [form, setForm] = useState(initialData || initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!editing) setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Nombre del Proyecto</label>
        <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Tipo de Proyecto</label>
        <input type="text" className="form-control" name="tipo" value={form.tipo} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} required />
      </div>
      <button className="btn btn-success" type="submit">{editing ? 'Actualizar' : 'Crear'} Proyecto</button>
    </form>
  );
};

export default ProjectsForm;
