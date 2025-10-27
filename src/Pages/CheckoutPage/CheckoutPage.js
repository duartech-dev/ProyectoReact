import React, { useContext, useEffect, useRef, useState } from 'react';
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
  const [customer, setCustomer] = useState({ name: '', id: '', phone: '', address: '' });
  const paypalRenderedRef = useRef(false);

  // Validación de Client ID para PayPal, usada en el render
  const clientIdRender = (process.env.REACT_APP_PAYPAL_CLIENT_ID || '').trim();
  const hasValidClientIdRender = clientIdRender && clientIdRender !== 'null' && clientIdRender !== 'undefined';

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
    const clientIdRaw = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    const clientId = (clientIdRaw || '').trim();
    const hasValidClientId = clientId && clientId !== 'null' && clientId !== 'undefined';
    if (!hasValidClientId || paid) return; // No cargar si ya se pagó o clientId inválido

    // Evitar agregar múltiples scripts
    const existingScript = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');

    const renderButtons = () => {
      try {
        if (!window.paypal) return;
        const container = document.getElementById('paypal-buttons-container');
        if (!container) return;
        // Evitar renders duplicados al reingresar
        if (paypalRenderedRef.current || container.childElementCount > 0) return;
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
            return actions.order.capture()
              .then(() => {
                setPaid(true);
                clearCart();
                Swal.fire({ icon: 'success', title: 'Pago realizado con PayPal', timer: 1800, showConfirmButton: false });
              })
              .catch((err) => {
                console.error('PayPal capture error:', err);
                Swal.fire({ icon: 'error', title: 'Error al capturar el pago' });
              });
          },
          onError: (err) => {
            console.error('PayPal Checkout Error:', err);
            Swal.fire({ icon: 'error', title: 'Error con PayPal', text: 'No se pudo procesar el pago.' });
          },
        }).render('#paypal-buttons-container');
        paypalRenderedRef.current = true;
      } catch (e) {
        console.error('PayPal render error', e);
        Swal.fire({ icon: 'error', title: 'Error inicializando PayPal' });
      }
    };

    if (!existingScript) {
      try {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=MXN`;
        script.addEventListener('load', renderButtons);
        script.addEventListener('error', () => Swal.fire({ icon: 'error', title: 'No se pudo cargar PayPal' }));
        document.body.appendChild(script);
      } catch (e) {
        console.error('Error creando script PayPal', e);
      }
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

      {/* Datos del cliente */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Datos del cliente</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre completo</label>
              <input className="form-control" value={customer.name} onChange={(e)=>setCustomer(c=>({...c, name:e.target.value}))} placeholder="Nombre y apellido" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Documento</label>
              <input className="form-control" value={customer.id} onChange={(e)=>setCustomer(c=>({...c, id:e.target.value}))} placeholder="CC / NIT" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input className="form-control" value={customer.phone} onChange={(e)=>setCustomer(c=>({...c, phone:e.target.value}))} placeholder="Celular" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Dirección</label>
              <input className="form-control" value={customer.address} onChange={(e)=>setCustomer(c=>({...c, address:e.target.value}))} placeholder="Dirección de entrega" />
            </div>
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Métodos de pago</div>
        <div className="card-body d-flex justify-content-center">
          {hasValidClientIdRender ? (
            <div id="paypal-buttons-container" style={{ width: '100%', maxWidth: 460 }}></div>
          ) : (
            <div className="text-center text-muted" style={{ width: '100%' }}>
              Configura REACT_APP_PAYPAL_CLIENT_ID para habilitar PayPal o usa "Simular pago (dev)".
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-outline-dark" onClick={() => navigate('/cart')}>Volver al carrito</button>
      {/* Simulamos pago éxito temporal */}
      <button
        className="btn btn-dark ms-2"
        onClick={async () => {
          try {
            const reference = `SIM-${Date.now()}`;
            const now = new Date();
            const fechaStr = now.toLocaleString('es-CO');
            const rows = cartItems.map(it => `
              <tr>
                <td style="padding:6px 8px;">${it.name}</td>
                <td style="padding:6px 8px; text-align:center;">${it.quantity}</td>
                <td style="padding:6px 8px; text-align:right;">${formatCurrency(it.price)}</td>
                <td style="padding:6px 8px; text-align:right;">${formatCurrency(it.price * it.quantity)}</td>
              </tr>
            `).join('');
            const html = `
              <div style="text-align:left">
                <div style="margin-bottom:8px; font-size:.9rem; opacity:.8;">Referencia: <strong>${reference}</strong> · Fecha: ${fechaStr}</div>
                <div style="margin-bottom:10px; font-size:.9rem;">
                  <div><strong>Cliente:</strong> ${customer.name || 'N/A'}</div>
                  <div><strong>Documento:</strong> ${customer.id || 'N/A'} · <strong>Tel:</strong> ${customer.phone || 'N/A'}</div>
                  <div><strong>Dirección:</strong> ${customer.address || 'N/A'}</div>
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:.95rem;">
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
                      <td style="padding:8px; text-align:right; border-top:1px solid #eee;"><strong>${formatCurrency(totalPrice)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            `;
            const res = await Swal.fire({
              title: 'Factura de compra',
              html,
              width: 700,
              showCancelButton: true,
              showDenyButton: true,
              confirmButtonText: 'Generar PDF',
              denyButtonText: 'Confirmar pago',
              cancelButtonText: 'Cancelar',
              focusConfirm: false,
            });

            const ensureJsPDF = () => new Promise((resolve, reject) => {
              if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
              const existing = document.querySelector('script[src*="jspdf"]');
              if (existing) {
                existing.addEventListener('load', () => resolve(window.jspdf.jsPDF));
                existing.addEventListener('error', reject);
                return;
              }
              const s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
              s.onload = () => resolve(window.jspdf.jsPDF);
              s.onerror = reject;
              document.body.appendChild(s);
            });

            if (res.isConfirmed) {
              try {
                const jsPDF = await ensureJsPDF();
                const doc = new jsPDF({ unit: 'pt', format: 'a4' });
                const margin = 40; let y = margin;
                doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
                doc.text('Factura - DecoCenter', margin, y); y += 22;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
                doc.text(`Referencia: ${reference}`, margin, y); y += 16;
                doc.text(`Fecha: ${fechaStr}`, margin, y); y += 24;
                doc.text(`Cliente: ${customer.name || 'N/A'}`, margin, y); y += 16;
                doc.text(`Documento: ${customer.id || 'N/A'}   Tel: ${customer.phone || 'N/A'}`, margin, y); y += 16;
                doc.text(`Dirección: ${customer.address || 'N/A'}`, margin, y); y += 16;
                doc.text(`Email: ${userEmail || 'N/A'}`, margin, y); y += 10;
                doc.setFont('helvetica', 'bold');
                doc.text('Producto', margin, y);
                doc.text('Cant.', margin + 300, y, { align: 'left' });
                doc.text('Precio', margin + 360, y, { align: 'left' });
                doc.text('Subtotal', margin + 440, y, { align: 'left' });
                y += 8; doc.setLineWidth(0.5); doc.line(margin, y, 555, y); y += 14;
                doc.setFont('helvetica', 'normal');
                cartItems.forEach((it) => {
                  const name = String(it.name || '').substring(0, 40);
                  doc.text(name, margin, y);
                  doc.text(String(it.quantity), margin + 300, y);
                  doc.text(`${(it.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}`, margin + 360, y);
                  doc.text(`${(it.price * it.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}`, margin + 440, y);
                  y += 16;
                });
                y += 6; doc.setLineWidth(0.5); doc.line(margin, y, 555, y); y += 18;
                doc.setFont('helvetica', 'bold');
                doc.text('Total:', margin + 360, y);
                doc.text(`${(totalPrice).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}`, margin + 440, y);
                y += 28; doc.setFont('helvetica', 'normal'); doc.text('Gracias por tu compra.', margin, y);
                doc.save(`Factura_${reference}.pdf`);
              } catch (_) {}

              const confirmRes = await Swal.fire({
                icon: 'question',
                title: '¿Confirmar pago?',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
              });
              if (!confirmRes.isConfirmed) return;
              clearCart();
              await Swal.fire({ icon: 'success', title: 'Pago realizado', text: `Ref: ${reference}`, timer: 1800, showConfirmButton: false });
              navigate('/');
              return;
            }

            if (res.isDenied) {
              clearCart();
              await Swal.fire({ icon: 'success', title: 'Pago realizado', text: `Ref: ${reference}`, timer: 1800, showConfirmButton: false });
              navigate('/');
            }
          } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'No se pudo procesar la simulación de pago' });
          }
        }}
      >
        Simular pago (dev)
      </button>
    </div>
  );
};

export default CheckoutPage;
