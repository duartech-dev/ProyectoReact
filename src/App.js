import React, { useState } from 'react';
import './App.css';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
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
  const [authView, setAuthView] = useState('login');

  console.log('App state:', { user, authView });

  const handleLoginSuccess = (userObj) => {
    console.log('Login success with user:', userObj);
    setUser(userObj);
    navigate('/');
  };

  const handleLogout = () => {
    setAuthView('login');
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
              <Route path="/cart" element={<CartPage onLogout={handleLogout} />} />
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
      ) : authView === 'login' ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          switchToRegister={() => setAuthView('register')}
        />
      ) : (
        <RegisterPage switchToLogin={() => setAuthView('login')} />
      )}
    </div>
  );
}

export default App;
