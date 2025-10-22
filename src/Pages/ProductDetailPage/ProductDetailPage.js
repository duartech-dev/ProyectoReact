import React, { useContext, useState, useMemo } from 'react';
import { CartContext } from '../../context/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import baseProducts from '../../data/products';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allProducts = useMemo(() => {
    try {
      const extra = JSON.parse(localStorage.getItem('admin_products') || '[]');
      return [...baseProducts, ...extra];
    } catch {
      return baseProducts;
    }
  }, []);

  const product = allProducts.find((p) => p.id.toString() === id);
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState(product ? product.image : '');

  if (!product) {
    return (
      <div className="container py-5">
        <h3>Producto no encontrado</h3>
        <button className="btn btn-link" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-4" onClick={() => navigate(-1)}>
        &larr; Volver
      </button>
      <div className="row g-4">
        <div className="col-md-6 order-2 order-md-1">
          <div className="d-flex gap-2 mb-3 overflow-auto">
            {[product.image, product.image, product.image].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                width={80}
                height={80}
                style={{
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: selectedImage === img ? '2px solid #000' : '1px solid #ccc',
                }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <img src={selectedImage} className="img-fluid rounded shadow-sm" alt={product.name} />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold mb-3">{product.name}</h2>
          <p className="text-muted mb-3">{product.description}</p>
          <h4 className="fw-bold mb-4">{formatCurrency(product.price)}</h4>
          <button className="btn btn-primary" onClick={() => { addToCart(product); navigate('/cart'); }}>Añadir al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
