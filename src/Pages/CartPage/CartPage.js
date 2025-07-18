import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CartPage = ({ onLogout }) => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Carrito</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Seguir comprando</button>
          <button className="btn btn-outline-danger" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
      {cartItems.length === 0 ? (
        <p className="lead">Tu carrito está vacío.</p>
      ) : (
        <>
          <table className="table align-middle shadow-sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="d-flex align-items-center gap-3">
                    <img src={item.image} alt={item.name} width={60} height={60} style={{objectFit: 'cover'}} />
                    <span>{item.name}</span>
                  </td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: {formatCurrency(totalPrice)}</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger" onClick={clearCart}>Vaciar carrito</button>
              <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Pagar</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
