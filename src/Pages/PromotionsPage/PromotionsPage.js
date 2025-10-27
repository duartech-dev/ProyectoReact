import React, { useEffect, useMemo, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { listenAllPromotions, createPromotion, updatePromotion, deletePromotion } from '../../services/promotionsService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/forms.css';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const initial = { id: null, name: '', description: '', price: '', discount: '0', image: '' };

const PromotionsPage = ({ userRole }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState(null);
  const [promos, setPromos] = useState([]);
  useEffect(() => {
    const unsub = listenAllPromotions(setPromos);
    return () => unsub && unsub();
  }, []);

  const formatCOP = (n) => Number(n || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

  const finalPrice = useMemo(() => {
    const p = Number(form.price) || 0;
    const d = Math.min(Math.max(Number(form.discount) || 0, 0), 100);
    return p * (1 - d / 100);
  }, [form.price, form.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result })); // Data URL para previsualizar/guardar
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(initial);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.image) return;
    const data = {
      name: form.name.trim(),
      description: (form.description || '').trim(),
      price: Number(form.price) || 0,
      discount: Math.min(Math.max(Number(form.discount) || 0, 0), 100),
      image: form.image,
    };
    try {
      if (form.id) {
        await updatePromotion(form.id, data);
        Swal.fire({ icon: 'success', title: 'Promoción actualizada', timer: 1200, showConfirmButton: false });
      } else {
        await createPromotion(data);
        Swal.fire({ icon: 'success', title: 'Promoción creada', timer: 1200, showConfirmButton: false });
      }
      resetForm();
    } catch (err) {
      console.error('Promotions save error:', err);
      Swal.fire({ icon: 'error', title: 'No se pudo guardar la promoción' });
    }
  };

  const handleEdit = (p) => setForm(p);
  const handleDelete = async (id) => {
    const res = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar promoción',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!res.isConfirmed) return;
    try {
      await deletePromotion(id);
      Swal.fire({ icon: 'success', title: 'Promoción eliminada', timer: 1000, showConfirmButton: false });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'No se pudo eliminar' });
    }
  };

  const canEdit = userRole === 'admin';
  const inputClass = 'form-control dc-input dc-input-brown';

  const handleView = (p) => {
    navigate(`/promotion/${p.id}`);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">Promociones</h2>
      {canEdit && (
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">Nombre</label>
          <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Precio (COP)</label>
          <input className={inputClass} name="price" value={form.price} onChange={handleChange} inputMode="numeric" placeholder="0" required />
          <small className="text-muted">Final: {formatCOP(finalPrice)}</small>
        </div>
        <div className="col-md-4">
          <label className="form-label">Descuento (%)</label>
          <input className={inputClass} name="discount" value={form.discount} onChange={handleChange} inputMode="numeric" placeholder="0" />
        </div>
        <div className="col-12">
          <label className="form-label">Imagen</label>
          <input type="file" accept="image/*" className={inputClass} onChange={handleFile} />
          {form.image && (
            <div className="mt-2">
              <img src={form.image} alt="preview" height={100} style={{ objectFit: 'cover', borderRadius: 6 }} />
            </div>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className={inputClass} rows={3} name="description" value={form.description} onChange={handleChange} placeholder="Detalles de la promoción"></textarea>
        </div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-dark" type="submit">{form.id ? 'Actualizar' : 'Agregar'}</button>
          {form.id && (
            <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancelar</button>
          )}
        </div>
      </form>
      )}

      <div className="row g-3">
        {promos.length === 0 && <p className="text-muted">Aún no hay promociones.</p>}
        {promos.map((p) => (
          <div key={p.id} className="col-12 col-md-6 col-lg-4">
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => handleView(p)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleView(p); } }}
            >
              <img src={p.image} className="card-img-top" alt={p.name} style={{ objectFit: 'cover', height: 180 }} />
              <div className="card-body">
                {p.discount > 0 && (
                  <span className="badge bg-danger position-absolute" style={{ top: 10, left: 10 }}>-{p.discount}%</span>
                )}
                <h6 className="fw-bold mb-1">{p.name}</h6>
                {p.discount > 0 ? (
                  <>
                    <p className="text-muted small mb-1 text-decoration-line-through">{formatCOP(p.price)}</p>
                    <p className="fw-bold mb-0">{formatCOP(p.price * (1 - p.discount / 100))}</p>
                  </>
                ) : (
                  <p className="fw-bold mb-0">{formatCOP(p.price)}</p>
                )}
              </div>
              {canEdit && (
              <div className="card-footer bg-white d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(p)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;
