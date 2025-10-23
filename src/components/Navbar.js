import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Navbar({ user, onLogout, onRequireAuth }) {
  const navigate = useNavigate();
  const { totalItems } = useContext(CartContext);

  const closeMenu = () => {
    const el = document.getElementById('navbarSupportedContent');
    if (!el) return;
    const bs = window.bootstrap; // Bootstrap 5 bundle expone window.bootstrap
    if (bs && bs.Collapse) {
      const instance = bs.Collapse.getInstance(el) || new bs.Collapse(el, { toggle: false });
      instance.hide();
    } else {
      // Fallback: quitar la clase 'show' si por alguna razón no está la API
      el.classList.remove('show');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Diseño Interior</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { closeMenu(); navigate('/'); }}>Inicio</span></li>
            <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { closeMenu(); navigate('/store'); }}>Tienda</span></li>
            <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { closeMenu(); navigate('/contact'); }}>Contáctenos</span></li>
            <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { closeMenu(); navigate('/promotions'); }}>Promociones</span></li>
            {user?.role === 'admin' && (
              <li className="nav-item"><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { closeMenu(); navigate('/admin'); }}>Agregar productos</span></li>
            )}
          </ul>
          <button className="btn position-relative me-3" onClick={() => { closeMenu(); navigate('/cart'); }}>
            <i className="bi bi-cart3 fs-5"></i>
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{totalItems}</span>
            )}
          </button>
          <span className="me-3 text-muted d-none d-lg-block">{user?.email}</span>
          {user?.role === 'guest' ? (
            <button className="btn btn-outline-secondary" onClick={() => { closeMenu(); onRequireAuth && onRequireAuth(); }}>
              Iniciar sesión
            </button>
          ) : (
            <button className="btn btn-outline-secondary" onClick={() => { closeMenu(); onLogout && onLogout(); }}>Cerrar sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}

