import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { saveOrder } from '../../services/orderService';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// PayPal integration se añadirá en el siguiente paso cuando tengamos el client-id
const CheckoutPage = ({ userEmail }) => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems.length, navigate]);

  // Exigir usuario logueado
  useEffect(() => {
    if (!userEmail) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para realizar el pago.',
        confirmButtonText: 'Ir al inicio'
      }).then(() => navigate('/'));
    }
  }, [userEmail, navigate]);

  // Cargar el SDK de PayPal y renderizar los botones
  useEffect(() => {
    const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    if (!clientId || paid) return; // No cargar si ya se pagó o no hay clientId

    // Evitar agregar múltiples scripts
    const existingScript = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');

    const renderButtons = () => {
      if (window.paypal) {
        const container = document.getElementById('paypal-buttons-container');
        if (container) container.innerHTML = '';
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: 'MXN',
                    value: totalPrice.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
              setPaid(true);
              saveOrder({ userEmail, items: cartItems, total: totalPrice }).catch(console.error);
              clearCart();
            });
          },
          onError: (err) => {
            console.error('PayPal Checkout Error:', err);
            alert('Ocurrió un error al procesar el pago.');
          },
        }).render('#paypal-buttons-container');
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=MXN`;
      script.addEventListener('load', renderButtons);
      document.body.appendChild(script);
    } else {
      renderButtons();
    }
  }, [totalPrice, paid, clearCart]);

  // Eliminado Wompi (Nequi/Davivienda) temporalmente

  if (paid) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">¡Gracias por tu compra! 🥳</h2>
        <button className="btn btn-dark" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Resumen de la compra</h2>
      <ul className="list-group mb-4">
        {cartItems.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
          Total
          <span>{formatCurrency(totalPrice)}</span>
        </li>
      </ul>

      {/* Métodos de pago */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Métodos de pago</div>
        <div className="card-body d-flex justify-content-center">
          <div id="paypal-buttons-container" style={{ width: '100%', maxWidth: 460 }}></div>
        </div>
      </div>

      <button className="btn btn-outline-dark" onClick={() => navigate('/cart')}>Volver al carrito</button>
      {/* Simulamos pago éxito temporal */}
      <button className="btn btn-dark ms-2" onClick={() => { setPaid(true); saveOrder({ userEmail, items: cartItems, total: totalPrice }).catch(console.error); clearCart(); }}>
        Simular pago (dev)
      </button>
    </div>
  );
};

export default CheckoutPage;
