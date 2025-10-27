import React, { useState } from 'react';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './style.css';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'duartech1598@gmail.com';

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

  // Admin por correo: no hay botón específico; se detecta por email al iniciar sesión

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      const role = user.email === ADMIN_EMAIL ? 'admin' : 'user';
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

  const handleForgotPassword = async () => {
    try {
      let email = (loginForm.email || '').trim().toLowerCase();
      if (!validateEmail(email)) {
        const { value } = await Swal.fire({
          title: 'Restablecer contraseña',
          input: 'email',
          inputLabel: 'Ingresa tu correo',
          inputPlaceholder: 'tu@correo.com',
          showCancelButton: true,
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar',
        });
        if (!value) return;
        email = String(value || '').trim().toLowerCase();
      }
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (!methods || methods.length === 0) {
        Swal.fire({ icon: 'error', title: 'Usuario no encontrado', text: 'No existe una cuenta con ese correo.' });
        return;
      }
      if (methods.includes('password')) {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({ icon: 'success', title: 'Correo enviado', text: 'Revisa tu bandeja (y spam) para restablecer la contraseña.' });
        return;
      }
      if (methods.includes('google.com')) {
        Swal.fire({ icon: 'info', title: 'Inicia con Google', text: 'Ese correo usa Google para iniciar sesión. Entra con el botón de Google.' });
        return;
      }
      Swal.fire({ icon: 'info', title: 'Método no soportado', text: 'La cuenta usa un proveedor diferente. Inicia con el mismo proveedor.' });
    } catch (error) {
      let msg = 'No se pudo enviar el correo';
      switch (error.code) {
        case 'auth/user-not-found':
          msg = 'No existe una cuenta con ese correo.'; break;
        case 'auth/invalid-email':
          msg = 'Correo no válido.'; break;
        default:
          msg = error.message || msg;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: msg });
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

    (async () => {
      try {
        const cred = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        const role = cred.user.email === ADMIN_EMAIL ? 'admin' : 'user';
        const userObj = { email: cred.user.email, role, name: cred.user.displayName };
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Hola ${cred.user.displayName || cred.user.email}`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => onLoginSuccess && onLoginSuccess(userObj));
      } catch (error) {
        let msg = 'Ocurrió un error';
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            msg = 'El correo o la contraseña son incorrectos'; break;
          case 'auth/too-many-requests':
            msg = 'Demasiados intentos. Inténtalo más tarde o restablece tu contraseña.'; break;
          default:
            msg = error.message || msg;
        }
        Swal.fire({ icon: 'error', title: 'Error de inicio de sesión', text: msg });
      }
    })();
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

    (async () => {
      try {
        // Verificar si el correo ya está registrado
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods && methods.length > 0) {
          await Swal.fire({
            icon: 'info',
            title: 'Correo ya registrado',
            text: 'Este correo ya tiene una cuenta. Inicia sesión o usa "Olvidé mi contraseña".',
          });
          setView('login');
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        await updateProfile(user, { displayName: name.trim() });
        try {
          await setDoc(doc(db, 'users', user.uid), {
            name: name.trim(),
            email: user.email,
            role: 'user',
            createdAt: serverTimestamp(),
          });
        } catch (e) {
          console.warn('No se pudo guardar el perfil en Firestore (continuando de todos modos):', e);
        }

        const role = user.email === ADMIN_EMAIL ? 'admin' : 'user';
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada. Entrando a la aplicación...',
          timer: 1200,
          showConfirmButton: false,
        }).then(() => onLoginSuccess && onLoginSuccess({ email: user.email, role, name: name.trim() }));
      } catch (error) {
        let msg = 'Ocurrió un error';
        switch (error.code) {
          case 'auth/email-already-in-use':
            msg = 'El correo ya está en uso. Inicia sesión o usa "Olvidé mi contraseña".';
            setView('login');
            break;
          case 'auth/invalid-email':
            msg = 'El correo no es válido.';
            break;
          case 'auth/weak-password':
            msg = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
            break;
          case 'auth/network-request-failed':
            msg = 'Problema de red. Verifica tu conexión.';
            break;
          default:
            msg = error.message || msg;
        }
        Swal.fire({ icon: 'error', title: 'Error de registro', text: msg });
      }
    })();
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
          <div className="mobile-only">
            <button type="button" className="mobile-link" onClick={toggleToLogin}>¿Ya tienes cuenta? Iniciar sesión</button>
          </div>
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
          <div style={{ marginTop: 8 }}>
            <button type="button" className="provider-btn" onClick={handleForgotPassword}>Olvidé mi contraseña</button>
          </div>
          <div className="provider-group">
            <button type="button" className="provider-btn" onClick={handleGuestAccess}>Entrar como Invitado</button>
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