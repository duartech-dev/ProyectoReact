import React, { useContext, useEffect, useState } from 'react';
import { saveOrder } from '../../services/orderService';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// PayPal integration se añadirá en el siguiente paso cuando tengamos el client-id
const CheckoutPage = ({ userEmail }) => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  // Controla si el widget de Wompi ya está disponible
  const [wompiReady, setWompiReady] = useState(false);

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

  // Cargar el SDK de PayPal y renderizar los botones
  useEffect(() => {
    const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    if (!clientId || paid) return; // No cargar si ya se pagó o no hay clientId

    // Evitar agregar múltiples scripts
    const existingScript = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');

    const renderButtons = () => {
      if (window.paypal) {
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

  // Cargar script de Wompi (Nequi / Davivienda)
  useEffect(() => {
    if (wompiReady) return; // Ya cargado
    const existing = document.querySelector('script[src^="https://checkout.wompi.co/widget.js"]');
    const onLoad = () => setWompiReady(true);

    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.addEventListener('load', onLoad);
      document.body.appendChild(script);
    } else {
      setWompiReady(true);
    }
  }, [wompiReady]);

  // Abrir widget con método seleccionado
  const handleWompiPayment = (paymentMethod) => {
    if (!wompiReady) {
      alert('La pasarela de pago aún se está cargando, intenta nuevamente en unos segundos.');
      return;
    }
    const publicKey = process.env.REACT_APP_WOMPI_PUBLIC_KEY;
    if (!publicKey) {
      alert('Falta configurar la variable REACT_APP_WOMPI_PUBLIC_KEY');
      return;
    }

    const amountInCents = Math.round(totalPrice * 100);
    const reference = `order-${Date.now()}`;

    const checkout = new window.WidgetCheckout({
      publicKey,
      currency: 'COP',
      amountInCents,
      reference,
      redirectUrl: window.location.href,
      paymentMethod, // 'NEQUI' o 'PSE'
    });

    checkout.open((result) => {
      if (result && result.transaction && result.transaction.status === 'APPROVED') {
        setPaid(true);
        saveOrder({ userEmail, items: cartItems, total: totalPrice }).catch(console.error);
        clearCart();
      } else if (result && result.transaction) {
        alert(`Transacción ${result.transaction.status}`);
      }
    });
  };

  if (paid) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">¡Gracias por tu compra! 🥳</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
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

      {/* Botones de Nequi y Davivienda */}
      <div className="mb-4 text-center">
        <button className="btn btn-success me-2" onClick={() => handleWompiPayment('NEQUI')}>
          <i className="bi bi-phone"></i> Pagar con Nequi
        </button>
        <button className="btn btn-danger" onClick={() => handleWompiPayment('PSE')}>
          <i className="bi bi-bank"></i> Pagar con Davivienda
        </button>
      </div>

      {/* Botones de PayPal */}
      <div id="paypal-buttons-container" className="mb-4 text-center"></div>

      <button className="btn btn-outline-secondary" onClick={() => navigate('/cart')}>Volver al carrito</button>
      {/* Simulamos pago éxito temporal */}
      <button className="btn btn-primary ms-2" onClick={() => { setPaid(true); saveOrder({ userEmail, items: cartItems, total: totalPrice }).catch(console.error); clearCart(); }}>
        Simular pago (dev)
      </button>
    </div>
  );
};

export default CheckoutPage;
