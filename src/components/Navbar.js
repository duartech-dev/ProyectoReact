import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar({ userEmail, onLogout }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const { totalItems } = useContext(CartContext);

  const toggleMenu = (menuIndex) => {
    setActiveMenu(activeMenu === menuIndex ? null : menuIndex);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Diseño Interior</div>
      <ul className="menu-main">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/store">Tienda</Link></li>
        <li><Link to="/contact">Contáctenos</Link></li>
        <li><Link to="/promotions">Promociones</Link></li>
        <li><span className="user-email">duartech1598@gmail.com</span></li>
        <li><Link className="cart-link" to="/cart"><img alt="Carrito" className="nav-icon" src="/assets/icons/shopping-cart.svg" /></Link></li>
        <li><a href="#" onClick={handleLogout}>Cerrar sesión</a></li>
      </ul>
    </nav>
  );
}
