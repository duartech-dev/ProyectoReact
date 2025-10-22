import React, { useState } from 'react';

const initial = { name: '', description: '', category: '', price: '', image: '' };

const AdminPage = () => {
  const [form, setForm] = useState(initial);
  const [list, setList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_products') || '[]');
    } catch {
      return [];
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.image) return;

    const newId = Date.now();
    const priceNum = Number(form.price);
    const product = {
      id: newId,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: isNaN(priceNum) ? 0 : priceNum,
      image: form.image.trim(),
    };

    const next = [...list, product];
    setList(next);
    localStorage.setItem('admin_products', JSON.stringify(next));
    setForm(initial);
    alert('Producto agregado');
  };

  const handleDelete = (id) => {
    const next = list.filter((p) => p.id !== id);
    setList(next);
    localStorage.setItem('admin_products', JSON.stringify(next));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Panel de Administrador</h2>
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">Nombre</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Categoría</label>
          <input className="form-control" name="category" value={form.category} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Precio (MXN)</label>
          <input className="form-control" name="price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Imagen (URL o ruta pública)</label>
          <input className="form-control" name="image" value={form.image} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button className="btn btn-dark">Agregar producto</button>
        </div>
      </form>

      <h5 className="mb-2">Productos agregados</h5>
      {list.length === 0 ? (
        <p className="text-muted">No hay productos aún.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.image} alt={p.name} width={60} height={60} style={{objectFit:'cover'}}/></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;