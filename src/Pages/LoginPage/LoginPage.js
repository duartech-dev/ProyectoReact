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
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="me-2" style={{ width: '20px' }} />
            Ingresar con Google
          </button>
          <button type="button" onClick={handleGithubLogin} className="btn btn-outline-dark w-100 github-btn">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="github" className="me-2" style={{ width: '20px' }} />
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
