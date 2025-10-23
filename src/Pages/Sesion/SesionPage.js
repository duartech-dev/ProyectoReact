import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './style.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

const SesionPage = ({ onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login' | 'register'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const toggleToRegister = () => setView('register');
  const toggleToLogin = () => setView('login');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((f) => ({ ...f, [name]: value }));
  };

  const handleGuestAccess = () => {
    const userObj = { email: 'invitado', role: 'guest', name: 'Invitado' };
    Swal.fire({
      icon: 'info',
      title: 'Modo invitado',
      text: 'Has ingresado como invitado. Para comprar deberás iniciar sesión.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => onLoginSuccess && onLoginSuccess(userObj));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((f) => ({ ...f, [name]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleAdminDemo = async () => {
    const { value: pwd } = await Swal.fire({
      title: 'Contraseña de administrador',
      input: 'password',
      inputLabel: 'Ingresa la contraseña',
      inputPlaceholder: '********',
      inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
      showCancelButton: true,
      confirmButtonText: 'Entrar',
      cancelButtonText: 'Cancelar',
    });

    if (pwd === undefined) return; // cancelado
    if (pwd !== 'password123') {
      Swal.fire({ icon: 'error', title: 'Contraseña incorrecta', text: 'Inténtalo de nuevo.' });
      return;
    }

    const userObj = { email: 'admin@example.com', role: 'admin', name: 'Administrador' };
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: 'Has iniciado sesión como Administrador',
      timer: 1200,
      showConfirmButton: false,
    }).then(() => onLoginSuccess && onLoginSuccess(userObj));
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      const role = user.email === 'admin@example.com' ? 'admin' : 'user';
      const userObj = { email: user.email, role, name: user.displayName };
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola ${user.displayName || user.email}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onLoginSuccess && onLoginSuccess(userObj));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      Swal.fire({ icon: 'error', title: 'Campos requeridos', text: 'Ingresa correo y contraseña' });
      return;
    }
    if (!validateEmail(loginForm.email)) {
      Swal.fire({ icon: 'error', title: 'Correo no válido', text: 'Verifica el formato del correo' });
      return;
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const matchedUser = storedUsers.find((u) => u.email === loginForm.email && u.password === loginForm.password);

      if (matchedUser) {
        const role = matchedUser.role || (matchedUser.email === 'admin@example.com' ? 'admin' : 'user');
        const userObj = { email: matchedUser.email, role, name: matchedUser.name };
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Hola ${matchedUser.name || matchedUser.email}`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => onLoginSuccess && onLoginSuccess(userObj));
        return;
      }

      if (loginForm.email === 'admin@example.com' && loginForm.password === 'password123') {
        const userObj = { email: loginForm.email, role: 'admin' };
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Has iniciado sesión correctamente',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => onLoginSuccess && onLoginSuccess(userObj));
      } else {
        Swal.fire({ icon: 'error', title: 'Credenciales inválidas', text: 'El correo o la contraseña son incorrectos' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Ocurrió un error' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = registerForm;

    const errors = [];
    if (!name.trim()) errors.push('El nombre es requerido');
    if (!email) errors.push('El correo es requerido');
    else if (!validateEmail(email)) errors.push('Correo no válido');
    if (!password) errors.push('La contraseña es requerida');
    else if (password.length < 6) errors.push('La contraseña debe tener mínimo 6 caracteres');
    if (password !== confirmPassword) errors.push('Las contraseñas no coinciden');

    if (errors.length > 0) {
      Swal.fire({ icon: 'error', title: 'Revise los campos', html: `<ul style="text-align:left;margin:0;padding-left:18px;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>` });
      return;
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const exists = storedUsers.some((u) => u.email === email);
      if (exists) {
        Swal.fire({ icon: 'error', title: 'Ya registrado', text: 'El correo ya está registrado' });
        return;
      }

      storedUsers.push({ name: name.trim(), email, password });
      localStorage.setItem('users', JSON.stringify(storedUsers));

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => setView('login'));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Ocurrió un error' });
    }
  };

  // Mantener las mismas clases para conservar el diseño original
  // Según CSS original: .sign-in está oculta por defecto y se muestra con .active.
  // .sign-up se oculta cuando tiene .active.
  // Para la vista 'login': sign-in ACTIVA (visible) y sign-up ACTIVA (oculta).
  // Para la vista 'register': ambas SIN active (sign-in oculta por defecto, sign-up visible).
  const signInClass = `container-form sign-in ${view === 'login' ? 'active' : ''}`.trim();
  const signUpClass = `container-form sign-up ${view === 'register' ? '' : 'active'}`.trim();

  return (
    <div className="sesion-root">
      {/* Sección de Registro (sign-up) */}
      <div className={signUpClass}>
        <div className="welcome-back">
          <div className="message">
            <h2>Bienvenido a Decocenter</h2>
            <p>Si ya tienes una cuenta por favor inicia sesion aqui</p>
            <button className="sign-up-btn" onClick={toggleToLogin}>Iniciar Sesion</button>
          </div>
        </div>
        <form className="formulario" onSubmit={handleRegister}>
          <h2 className="create-account">Crear una cuenta</h2>
          <p className="cuenta-gratis">Crear una cuenta gratis</p>
          <input type="text" placeholder="Nombre" name="name" value={registerForm.name} onChange={handleRegisterChange} />
          <input type="email" placeholder="Email" name="email" value={registerForm.email} onChange={handleRegisterChange} />
          <input type="password" placeholder="Contraseña" name="password" value={registerForm.password} onChange={handleRegisterChange} />
          <input type="password" placeholder="Confirmar contraseña" name="confirmPassword" value={registerForm.confirmPassword} onChange={handleRegisterChange} />
          <input type="submit" value="Registrarse" />
        </form>
      </div>

      {/* Sección de Login (sign-in) */}
      <div className={signInClass}>
        <form className="formulario" onSubmit={handleLogin}>
          <h2 className="create-account">Iniciar Sesion</h2>
          <p className="cuenta-gratis">¿Aun no tienes una cuenta?</p>
          <input type="email" placeholder="Email" name="email" value={loginForm.email} onChange={handleLoginChange} />
          <input type="password" placeholder="Contraseña" name="password" value={loginForm.password} onChange={handleLoginChange} />
          <div className="actions-row">
            <input type="submit" value="Iniciar Sesion" />
            <button type="button" className="outline-light-btn" onClick={toggleToRegister}>Registrarse</button>
          </div>
          <div className="provider-group">
            <button type="button" className="provider-btn" onClick={handleGuestAccess}>Entrar como Invitado</button>
            <button type="button" className="provider-btn admin-btn" onClick={handleAdminDemo}>Entrar como Administrador</button>
            <div className="provider-separator">o</div>
            <button type="button" className="provider-btn google-btn" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{marginRight: '8px'}}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Ingresar con Google
            </button>
          </div>
        </form>
        <div className="welcome-back">
          <div className="message">
            <h2>Bienvenido de nuevo</h2>
            <p>Si aun no tienes una cuenta por favor registrese aqui</p>
            <button className="sign-in-btn" onClick={toggleToRegister}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SesionPage;