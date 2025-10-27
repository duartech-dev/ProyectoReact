import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CartContext } from '../../context/CartContext';

const PromotionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [promo, setPromo] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const ref = doc(db, 'promotions', id);
        const snap = await getDoc(ref);
        if (!ignore) {
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            setPromo(data);
            setSelectedImage(data.image || '');
          } else {
            setPromo(null);
          }
        }
      } catch (e) {
        console.error('Error cargando promoción:', e);
        if (!ignore) setPromo(null);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (!promo) {
    return (
      <div className="container py-5">
        <h3>Promoción no encontrada</h3>
        <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const calcFinal = (p) => {
    const d = Number(p.discount || 0);
    const price = Number(p.price || 0);
    return d > 0 ? Math.round(price * (1 - d / 100)) : price;
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });

  const finalPrice = calcFinal(promo);

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        &larr; Volver
      </button>
      <div className="row g-4">
        <div className="col-md-6 order-2 order-md-1">
          <div className="d-flex gap-2 mb-3 overflow-auto">
            {[promo.image, promo.image, promo.image].filter(Boolean).map((img, idx) => (
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
            <img src={selectedImage} className="img-fluid rounded shadow-sm" alt={promo.name} />
          )}
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold mb-3">{promo.name}</h2>
          {Number(promo.discount || 0) > 0 ? (
            <>
              <p className="text-muted mb-1" style={{textDecoration: 'line-through'}}>{formatCurrency(promo.price)}</p>
              <h4 className="fw-bold mb-4">{formatCurrency(finalPrice)}</h4>
            </>
          ) : (
            <h4 className="fw-bold mb-4">{formatCurrency(promo.price)}</h4>
          )}
          <button
            className="btn btn-dark"
            onClick={() => { addToCart({ id: promo.id, name: promo.name, price: finalPrice, image: promo.image, description: 'Promoción' }); navigate('/cart'); }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;
