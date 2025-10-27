import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { listenAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/productsService';
import '../../styles/forms.css';

const initial = { id: null, name: '', description: '', category: '', price: '', image: '' };

const AdminPage = ({ userRole }) => {
  const [form, setForm] = useState(initial);
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsub = listenAllProducts(setList);
    return () => unsub && unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.image) return;

    const priceNum = Number(form.price);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: isNaN(priceNum) ? 0 : priceNum,
        image: (form.image || '').trim(),
      };
      if (form.id) {
        await updateProduct(form.id, payload);
        Swal.fire({ icon: 'success', title: 'Producto actualizado', timer: 1200, showConfirmButton: false });
      } else {
        await createProduct(payload);
        Swal.fire({ icon: 'success', title: 'Producto agregado', timer: 1200, showConfirmButton: false });
      }
      setForm(initial);
    } catch (err) {
      console.error('Create product error:', err);
      Swal.fire({ icon: 'error', title: 'No se pudo guardar el producto' });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar producto',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!res.isConfirmed) return;
    try {
      await deleteProduct(id);
      Swal.fire({ icon: 'success', title: 'Producto eliminado', timer: 1000, showConfirmButton: false });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'No se pudo eliminar' });
    }
  };

  const isAdmin = userRole === 'admin';
  const inputClass = 'form-control dc-input dc-input-brown';

  const handleEdit = (p) => setForm({
    id: p.id,
    name: p.name || '',
    description: p.description || '',
    category: p.category || '',
    price: String(p.price ?? ''),
    image: p.image || '',
  });

  const handleCancel = () => setForm(initial);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Panel de Administrador</h2>
      {isAdmin && (
        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Categoría</label>
            <input className={inputClass} name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Precio (COP)</label>
            <input className={inputClass} name="price" value={form.price} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Imagen</label>
            <input type="file" accept="image/*" className={inputClass} onChange={handleFileChange} required />
            {form.image && (
              <div className="mt-2">
                <img src={form.image} alt="preview" height={80} style={{ objectFit: 'cover', borderRadius: 6 }} />
              </div>
            )}
          </div>
          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea className={inputClass} name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-dark" type="submit">{form.id ? 'Actualizar producto' : 'Agregar producto'}</button>
            {form.id && (
              <button className="btn btn-outline-secondary" type="button" onClick={handleCancel}>Cancelar</button>
            )}
          </div>
        </form>
      )}

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
                  <td><img src={p.image} alt={p.name} width={60} height={60} style={{ objectFit: 'cover' }} /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</td>
                  <td>
                    {isAdmin && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(p)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                      </div>
                    )}
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