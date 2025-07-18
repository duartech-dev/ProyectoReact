import React, { useState } from 'react';
import './App.css';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
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

function App() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [authView, setAuthView] = useState('login');

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    navigate('/');
  };

  const handleLogout = () => {
    setAuthView('login');
    setUserEmail(null);
  };

  return (
    <div className="App">
      {userEmail ? (
        <Routes>
          <Route path="/" element={<HomePage userEmail={userEmail} onLogout={handleLogout} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage onLogout={handleLogout} />} />
          <Route path="/checkout" element={<CheckoutPage userEmail={userEmail} />} />
          <Route path="/store" element={<StorePage userEmail={userEmail} onLogout={handleLogout} />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/proyectos/*" element={
            <ProjectsProtectedRoute userEmail={userEmail}>
              <ProjectsPage />
            </ProjectsProtectedRoute>
          } />
        </Routes>
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
