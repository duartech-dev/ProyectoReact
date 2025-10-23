import React, { useState } from 'react';
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
import ContactPage from './Pages/ContactPage/ContactPage';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProjectsPage from './Pages/ProjectsPage/ProjectsPage';
import ProjectsProtectedRoute from './Pages/ProjectsPage/ProjectsProtectedRoute';
import Navbar from './components/Navbar';

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
    setUser(null);
  };

  const handleRequireAuth = () => {
    // Forzar pantalla de autenticación
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <div style={{ marginTop: '80px' }}>
            <Routes>
              <Route path="/" element={<HomePage userEmail={user?.email} userRole={user?.role} onLogout={handleLogout} />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage onLogout={handleLogout} isGuest={user?.role === 'guest'} onRequireAuth={handleRequireAuth} />} />
              <Route path="/checkout" element={<CheckoutPage userEmail={user?.email} />} />
              <Route path="/store" element={<StorePage userEmail={user?.email} userRole={user?.role} onLogout={handleLogout} />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/proyectos/*" element={
                <ProjectsProtectedRoute userEmail={user?.email}>
                  <ProjectsPage />
                </ProjectsProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminProtectedRoute user={user}>
                  <AdminPage />
                </AdminProtectedRoute>
              } />
            </Routes>
          </div>
        </>
      ) : (
        <SesionPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
