import React, { useEffect, useState } from 'react';
import './App.css';
import './Pages/HomePage/HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SesionPage from './Pages/Sesion/SesionPage';
import AdminPage from './Pages/Admin/AdminPage';
import AdminProtectedRoute from './Pages/Admin/AdminProtectedRoute';
import HomePage from './Pages/HomePage/HomePage';
import ProductDetailPage from './Pages/ProductDetailPage/ProductDetailPage';
import CartPage from './Pages/CartPage/CartPage';
import StorePage from './Pages/StorePage/StorePage';
import PromotionsPage from './Pages/PromotionsPage/PromotionsPage';
import PromotionDetailPage from './Pages/PromotionDetailPage/PromotionDetailPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ProjectsPage from './Pages/ProjectsPage/ProjectsPage';
import ProjectsProtectedRoute from './Pages/ProjectsPage/ProjectsProtectedRoute';
import Navbar from './components/Navbar';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  console.log('App state:', { user });

  const handleLoginSuccess = (userObj) => {
    console.log('Login success with user:', userObj);
    setUser(userObj);
    navigate('/');
  };

  const handleLogout = () => {
    // Notificar a quien gestione el carrito que debe vaciarse
    try {
      window.dispatchEvent(new Event('app-logout'));
      localStorage.removeItem('cart');
    } catch (_) {}
    setUser(null);
  };

  const handleRequireAuth = () => {
    // Forzar pantalla de autenticación
    setUser(null);
  };

  return (
    <div className="App">
      <ScrollToTop />
      {user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} onRequireAuth={handleRequireAuth} />
          <div style={{ marginTop: '80px' }}>
            <Routes>
              <Route path="/" element={<HomePage userEmail={user?.email} userRole={user?.role} onLogout={handleLogout} />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage onLogout={handleLogout} isGuest={user?.role === 'guest'} onRequireAuth={handleRequireAuth} />} />
              <Route path="/checkout" element={<CheckoutPage userEmail={user?.email} />} />
              <Route path="/store" element={<StorePage userEmail={user?.email} userRole={user?.role} onLogout={handleLogout} />} />
              <Route path="/promotions" element={<PromotionsPage userRole={user?.role} />} />
              <Route path="/promotion/:id" element={<PromotionDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/proyectos/*" element={
                <ProjectsProtectedRoute userEmail={user?.email}>
                  <ProjectsPage />
                </ProjectsProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminProtectedRoute user={user}>
                  <AdminPage userRole={user?.role} />
                </AdminProtectedRoute>
              } />
            </Routes>
          </div>
          {/* Botón flotante de WhatsApp */}
          <a
            href={`https://wa.me/573001234567?text=${encodeURIComponent('Hola, me gustaría obtener más información sobre un producto.')}`}
            className="wa-float"
            target="_blank"
            rel="noreferrer"
            aria-label="Contactar por WhatsApp"
          >
            <i className="bi bi-whatsapp"></i>
          </a>
        </>
      ) : (
        <>
          <SesionPage onLoginSuccess={handleLoginSuccess} />
          {/* Botón flotante de WhatsApp (visible también en login) */}
          <a
            href={`https://wa.me/573001234567?text=${encodeURIComponent('Hola, me gustaría obtener más información.')}`}
            className="wa-float"
            target="_blank"
            rel="noreferrer"
            aria-label="Contactar por WhatsApp"
          >
            <i className="bi bi-whatsapp"></i>
          </a>
        </>
      )}
    </div>
  );
}

export default App;
