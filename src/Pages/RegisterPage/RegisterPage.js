import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './RegisterPage.css';

const RegisterPage = ({ switchToLogin }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';

    if (!form.email) newErrors.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo no válido';

    if (!form.password) newErrors.password = 'La contraseña es requerida';
    else if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = storedUsers.some((u) => u.email === form.email);
    if (exists) {
      Swal.fire({ icon: 'error', title: 'Ya registrado', text: 'El correo ya está registrado' });
      return;
    }

    storedUsers.push({ name: form.name, email: form.email, password: form.password });
    localStorage.setItem('users', JSON.stringify(storedUsers));

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Ahora puedes iniciar sesión',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => switchToLogin());
  };

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4 register-card">
        <h3 className="text-center mb-4">Crear cuenta</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="********"
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100">Registrarse</button>
        </form>
        <p className="text-center mt-3">
          ¿Ya tienes cuenta?{' '}
          <span role="button" className="text-primary fw-bold" onClick={switchToLogin}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
