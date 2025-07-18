import React from 'react';
import { useNavigate } from 'react-router-dom';
import products from '../../data/products';
import 'bootstrap/dist/css/bootstrap.min.css';

const promoProducts = products.slice(0, 3).map((p) => ({ ...p, discount: 0.15 }));

const PromotionsPage = () => {
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">Promociones</h2>
      <div className="row g-4">
        {promoProducts.map((product) => (
          <div key={product.id} className="col-6 col-md-4">
            <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
              <img src={product.image} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: '180px' }} />
              <div className="card-body">
                <span className="badge bg-danger position-absolute" style={{ top: '10px', left: '10px' }}>-{product.discount * 100}%</span>
                <h6 className="card-title fw-bold mb-1 mt-4">{product.name}</h6>
                <p className="text-muted small mb-1 text-decoration-line-through">{formatCurrency(product.price)}</p>
                <p className="fw-bold">{formatCurrency(product.price * (1 - product.discount))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;
