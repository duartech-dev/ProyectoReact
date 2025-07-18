import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías enviar la información a un backend o servicio
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-4" onClick={() => navigate(-1)}>&larr; Volver</button>
      <h2 className="fw-bold mb-4 text-center">Contáctenos</h2>

      {submitted && (
        <div className="alert alert-success" role="alert">
          ¡Gracias por contactarnos! Te responderemos pronto.
        </div>
      )}

      <form className="row g-3 mx-auto" style={{ maxWidth: '600px' }} onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label htmlFor="message" className="form-label">Mensaje</label>
          <textarea className="form-control" id="message" rows="5" name="message" value={form.message} onChange={handleChange} required></textarea>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary">Enviar mensaje</button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
