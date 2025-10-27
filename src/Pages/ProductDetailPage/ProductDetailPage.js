import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (!ignore) {
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            setProduct(data);
            const initialImg = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
            setSelectedImage(initialImg);
            setNotFound(false);
          } else {
            setProduct(null);
            setNotFound(true);
          }
        }
      } catch (e) {
        console.error('Error cargando producto:', e);
        if (!ignore) {
          setProduct(null);
          setNotFound(true);
        }
      }
      finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border" role="status" style={{ color: '#5c3a29' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container py-5">
        <h3>Producto no encontrado</h3>
        <div className="mt-3">
          <span
            role="button"
            onClick={() => navigate(-1)}
            style={{ color: '#5c3a29', textDecoration: 'underline' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver a la tienda
          </span>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });

  const rating = Math.max(0, Math.min(5, Math.round(Number(product.rating ?? 4))));

  return (
    <div className="container py-5">
      <div className="mb-3" style={{ fontSize: '.95rem' }}>
        <span
          role="button"
          onClick={() => navigate(-1)}
          style={{ color: '#5c3a29', textDecoration: 'underline' }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la tienda
        </span>
      </div>
      <div className="row g-4">
        <div className="col-md-6 order-2 order-md-1">
          <div className="d-flex gap-2 mb-3 overflow-auto">
            {(Array.isArray(product.images) && product.images.length > 0 ? product.images.slice(0,4) : [product.image]).filter(Boolean).map((img, idx) => (
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
          {selectedImage && (
            <img src={selectedImage} className="img-fluid rounded shadow-sm" alt={product.name} />
          )}
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold mb-1">{product.name}</h2>
          <div className="mb-3" aria-label={`Calificación ${rating} de 5`}>
            {[0,1,2,3,4].map(i => (
              <i
                key={i}
                className={i < rating ? 'bi bi-star-fill me-1' : 'bi bi-star me-1'}
                style={{ color: '#f5a524' }}
              />
            ))}
            <small className="text-muted">{rating}/5</small>
          </div>
          <p className="text-muted mb-3">{product.description}</p>
          <h4 className="fw-bold mb-4">{formatCurrency(product.price)}</h4>
          <button className="btn btn-dark" onClick={() => { addToCart(product); navigate('/cart'); }}>Añadir al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
