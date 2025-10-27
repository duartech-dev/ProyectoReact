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
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (!ignore) {
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            setProduct(data);
            const initialImg = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
            setSelectedImage(initialImg);
          } else {
            setProduct(null);
          }
        }
      } catch (e) {
        console.error('Error cargando producto:', e);
        if (!ignore) setProduct(null);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (!product) {
    return (
      <div className="container py-5">
        <h3>Producto no encontrado</h3>
        <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        &larr; Volver
      </button>
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
          <h2 className="fw-bold mb-3">{product.name}</h2>
          <p className="text-muted mb-3">{product.description}</p>
          <h4 className="fw-bold mb-4">{formatCurrency(product.price)}</h4>
          <button className="btn btn-dark" onClick={() => { addToCart(product); navigate('/cart'); }}>Añadir al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
