import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CartPage = ({ onLogout, isGuest, onRequireAuth }) => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  const [history, setHistory] = useState([]);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('purchase_history') || '[]');
      setHistory(Array.isArray(data) ? data : []);
    } catch { setHistory([]); }
  }, []);

  const [showHistory, setShowHistory] = useState(false);

  const clearHistory = () => {
    localStorage.removeItem('purchase_history');
    setHistory([]);
  };

  const nextStatus = (s) => {
    if (s === 'En proceso') return 'Enviado';
    if (s === 'Enviado') return 'Entregado';
    return 'Entregado';
  };

  const advanceStatus = async (index) => {
    const current = history[index];
    if (!current) return;
    const proposed = nextStatus(current.status || 'En proceso');
    const res = await Swal.fire({
      icon: 'question',
      title: 'Actualizar estado de entrega',
      text: `¿Cambiar de "${current.status || 'En proceso'}" a "${proposed}"?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    });
    if (!res.isConfirmed) return;
    const newHist = history.map((h, i) => i === index ? { ...h, status: proposed, updatedAt: new Date().toISOString() } : h);
    setHistory(newHist);
    try { localStorage.setItem('purchase_history', JSON.stringify(newHist)); } catch(_) {}
    Swal.fire({ icon: 'success', title: 'Estado actualizado', timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Carrito</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark" onClick={() => navigate('/')}>Seguir comprando</button>
          <button className="btn btn-outline-secondary" onClick={() => setShowHistory(s=>!s)}>
            {showHistory ? 'Ocultar historial' : 'Ver historial'}
          </button>
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
              <button
                className="btn btn-dark"
                onClick={() => {
                  if (isGuest) {
                    Swal.fire({
                      icon: 'question',
                      title: '¿Cómo deseas continuar?',
                      text: 'Para pagar necesitas iniciar sesión. ¿Quieres ir a iniciar sesión ahora? ',
                      showCancelButton: true,
                      confirmButtonText: 'Iniciar sesión',
                      cancelButtonText: 'Seguir como invitado',
                      allowOutsideClick: false,
                    }).then((res) => {
                      if (res.isConfirmed) {
                        if (onRequireAuth) onRequireAuth();
                      }
                    });
                    return; 
                  }
                  navigate('/checkout');
                }}
              >
                Pagar
              </button>
            </div>
          </div>
        </>
      )}

      {showHistory && (
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Historial de compras (local)</h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={clearHistory}>Limpiar historial</button>
          </div>
          {history.length === 0 ? (
            <p className="text-muted">No hay compras registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Referencia</th>
                    <th>Fecha</th>
                    <th>Método</th>
                    <th>Entrega</th>
                    <th>Total</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr key={idx}>
                      <td>{h.reference}</td>
                      <td>{new Date(h.createdAt).toLocaleString('es-CO')}</td>
                      <td>{h.method}</td>
                      <td>
                        <span className="badge rounded-pill" style={{ backgroundColor: '#eae1db', color: '#5c3a29' }}>
                          {h.status || 'En proceso'}
                        </span>
                        <button
                          className="btn btn-sm btn-brown-outline ms-2"
                          onClick={() => advanceStatus(idx)}
                          disabled={(h.status || 'En proceso') === 'Entregado'}
                        >
                          Avanzar
                        </button>
                      </td>
                      <td>{formatCurrency(h.total)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-dark" onClick={() => {
                          const rows = (h.items||[]).map(it => `
                            <tr>
                              <td style="padding:6px 8px;">${it.name}</td>
                              <td style="padding:6px 8px; text-align:center;">${it.quantity}</td>
                              <td style="padding:6px 8px; text-align:right;">${(it.price).toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})}</td>
                              <td style="padding:6px 8px; text-align:right;">${(it.price*it.quantity).toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})}</td>
                            </tr>
                          `).join('');
                          const html = `
                            <div style="text-align:left">
                              <div style="margin-bottom:6px; font-size:.9rem; opacity:.85;">Ref: <strong>${h.reference}</strong> · ${new Date(h.createdAt).toLocaleString('es-CO')}</div>
                              <div style="margin-bottom:8px; font-size:.9rem;">
                                <div><strong>Cliente:</strong> ${(h.customer?.name)||'N/A'} · <strong>Documento:</strong> ${(h.customer?.id)||'N/A'}</div>
                                <div><strong>Tel:</strong> ${(h.customer?.phone)||'N/A'} · <strong>Direccion:</strong> ${(h.customer?.address)||'N/A'}</div>
                                <div><strong>Email:</strong> ${h.userEmail||'N/A'}</div>
                              </div>
                              <table style="width:100%; border-collapse:collapse; font-size:.9rem;">
                                <thead>
                                  <tr>
                                    <th style="text-align:left; padding:6px 8px; border-bottom:1px solid #eee;">Producto</th>
                                    <th style="text-align:center; padding:6px 8px; border-bottom:1px solid #eee;">Cant.</th>
                                    <th style="text-align:right; padding:6px 8px; border-bottom:1px solid #eee;">Precio</th>
                                    <th style="text-align:right; padding:6px 8px; border-bottom:1px solid #eee;">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>${rows}</tbody>
                                <tfoot>
                                  <tr>
                                    <td colspan="3" style="padding:8px; text-align:right; border-top:1px solid #eee;"><strong>Total</strong></td>
                                    <td style="padding:8px; text-align:right; border-top:1px solid #eee;"><strong>${(h.total).toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})}</strong></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>`;
                          Swal.fire({ title: `Compra ${h.reference}`, html, confirmButtonText: 'Cerrar' });
                        }}>Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
;

export default CartPage;
