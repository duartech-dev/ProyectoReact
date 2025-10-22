import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import products from '../../data/products';
import 'bootstrap/dist/css/bootstrap.min.css';

const StorePage = ({ userEmail, userRole, onLogout }) => {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const allProducts = useMemo(() => {
    try {
      const extra = JSON.parse(localStorage.getItem('admin_products') || '[]');
      return [...products, ...extra];
    } catch {
      return products;
    }
  }, []);

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(allProducts.map((p) => p.category)))], [allProducts]);

  const filteredProducts =
    selectedCategory === 'Todos'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="store-page d-flex flex-column min-vh-100">

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
                  <button className="btn btn-outline-dark btn-sm mt-auto custom-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); navigate('/cart'); }}>
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
