import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import products from '../../data/products';
import 'bootstrap/dist/css/bootstrap.min.css';

const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

const StorePage = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts =
    selectedCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="store-page d-flex flex-column min-vh-100">
      {/* NAVBAR (copied from design) */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Diseño Interior</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Inicio</span></li>
              <li className="nav-item"><span className="nav-link active" style={{ cursor: 'pointer' }}>Tienda</span></li>
              <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>Contáctenos</span></li>
              <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/promotions')}>Promociones</span></li>
            </ul>
            <button className="btn position-relative me-3" onClick={() => navigate('/cart')}>
              <i className="bi bi-cart3 fs-5"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{totalItems}</span>
              )}
            </button>
            <span className="me-3 text-muted d-none d-lg-block">{userEmail}</span>
            <button className="btn btn-outline-secondary" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </div>
      </nav>

      {/* CATEGORY FILTER */}
      <div className="container my-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {categories.map((cat) => (
            <button key={cat} className={`btn btn-sm ${selectedCategory === cat ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="container pb-5">
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: '180px' }} />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold mb-1">{product.name}</h6>
                  <p className="card-text text-muted small mb-2">{product.description}</p>
                  <p className="fw-bold mb-4">{formatCurrency(product.price)}</p>
                  <button className="btn btn-outline-primary btn-sm mt-auto" onClick={(e) => { e.stopPropagation(); addToCart(product); navigate('/cart'); }}>
                    <i className="bi bi-cart3 me-1"></i>Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
