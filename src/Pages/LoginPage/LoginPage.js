import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../firebase';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess, switchToRegister }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo no válido';
    if (!form.password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola ${user.displayName || user.email}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onLoginSuccess(user.email));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const { user } = result;
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola ${user.displayName || user.email}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onLoginSuccess(user.email));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', form);
    if (!validate()) return;

    // Buscar usuario en localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = storedUsers.find((u) => u.email === form.email && u.password === form.password);

    if (matchedUser) {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola ${matchedUser.name || matchedUser.email}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onLoginSuccess(matchedUser.email));
      return;
    }

    // Credenciales de demostración
    if (form.email === 'admin@example.com' && form.password === 'password123') {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Has iniciado sesión correctamente',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onLoginSuccess(form.email));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales inválidas',
        text: 'El correo o la contraseña son incorrectos',
      });
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4 login-card">
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit} noValidate>
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

          <div className="mb-4">
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

          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          <div className="text-center my-3">o</div>
          <button type="button" onClick={handleGoogleLogin} className="btn btn-outline-danger w-100 google-btn mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Ingresar con Google
          </button>
          <button type="button" onClick={handleGithubLogin} className="btn btn-outline-dark w-100 github-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Ingresar con GitHub
          </button>
        </form>
        <p className="text-center mt-3">
          ¿No tienes cuenta?{' '}
          <span role="button" className="text-primary fw-bold" onClick={switchToRegister}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
