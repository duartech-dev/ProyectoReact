import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones mínimas
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Tu nombre es requerido';
    if (!form.email.trim()) nextErrors.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Correo no válido';
    if (!form.message.trim()) nextErrors.message = 'Escribe tu mensaje';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Aquí podrías enviar la información a un backend o servicio
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>&larr; Volver</button>
      <h2 className="fw-bold mb-4 text-center">Contáctenos</h2>

      {submitted && (
        <div className="alert alert-success" role="alert">
          ¡Gracias por contactarnos! Te responderemos pronto.
        </div>
      )}

      <div className="mx-auto" style={{ maxWidth: '680px' }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <form className="row g-3" onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="col-12">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-12">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  autoComplete="off"
                  inputMode="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-12">
                <label htmlFor="message" className="form-label">Mensaje</label>
                <textarea
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  id="message"
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos en qué podemos ayudarte"
                  autoComplete="off"
                ></textarea>
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
              </div>

              <div className="col-12 d-flex justify-content-end">
                <button type="submit" className="btn btn-dark">Enviar mensaje</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

