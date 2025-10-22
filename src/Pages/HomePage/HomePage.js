import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProjectsMenu from '../ProjectsPage/ProjectsMenu';
import Products from './Products';
import products from '../../data/products';

// Imágenes para el carrusel y productos desde public/assets
const carouselImages = [
  '/assets/22-ABRIL-scaled-1.jpg',
  '/assets/closet.jpg',
  '/assets/puerta.jpg',
];

// Lista de categorías calculadas a partir de productos combinados

function HomePage({ userEmail, onLogout }) {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const allProducts = useMemo(() => {
    try {
      const extra = JSON.parse(localStorage.getItem('admin_products') || '[]');
      return [...products, ...extra];
    } catch {
      return products;
    }
  }, []);

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(allProducts.map((p) => p.category)))], [allProducts]);

  const filteredProducts =
    selectedCategory === 'Todos'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="home-page d-flex flex-column min-vh-100">

      {/* HERO */}
      <section className="hero container text-center my-5">
        <h2 className="mb-4 fw-bold">Los mejores diseños de interiores del mundo</h2>
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-wrap="true">
          <div className="carousel-indicators">
            {carouselImages.map((_, idx) => (
              <button 
                key={idx}
                type="button" 
                data-bs-target="#heroCarousel" 
                data-bs-slide-to={idx} 
                className={idx === 0 ? 'active' : ''} 
                aria-current={idx === 0 ? 'true' : 'false'} 
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner rounded shadow-sm">
            {carouselImages.map((img, idx) => (
              <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={img}>
                <img src={img} className="d-block w-100" alt={`slide ${idx + 1}`} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <Products />

      {/* CATEGORY FILTER */}
      <div className="container my-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {categories.map((cat) => (
            <button key={cat} className={`btn btn-sm ${selectedCategory === cat ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="container pb-5">
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: '180px' }} />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold mb-1">{product.name}</h6>
                  <p className="card-text text-muted small mb-2">{product.description}</p>
                  <p className="fw-bold mb-4">{formatCurrency(product.price)}</p>
                  <button className="btn btn-outline-secondary btn-sm mt-auto custom-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); navigate('/cart'); }}>
                    <i className="bi bi-cart3 me-1"></i>Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="saw-icon">
            <img src="/assets/Sierra.svg" alt="Sierra" className="rotating-saw" />
          </div>
          <h2 className="hero-title">Se auténtico, crea tu propio estilo de hogar.</h2>
          <p className="hero-subtitle">Descubre nuestros diseños unicos y peronalizados para tu hogar.</p>
          <button className="hero-button">Descubrelo</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-deco">
        <div className="container">
          <div className="row">
            {/* Columna izquierda - Nombre y navegación */}
            <div className="col-md-4">
              <h3 className="footer-title">DECOCENTER</h3>
              <ul className="footer-nav">
                <li><a href="/">Inicio</a></li>
                <li><a href="/contact">Contactenos</a></li>
                <li><a href="#">Politicas de Privacidad</a></li>
                <li><a href="#">Foro</a></li>
              </ul>
            </div>
            
            {/* Columna central - Descripción y contacto */}
            <div className="col-md-4">
              <p className="footer-description">
                Somos una empresa enfocada en el diseño de interiores, Le damos un mejor aspecto a sus espacios con nuestros diseños unicos y modernos.
              </p>
              <div className="footer-contact">
                <div className="contact-item">
                  <img src="/assets/icons/phone.svg" alt="Teléfono" className="contact-icon" />
                  <span>(318)665-7064</span>
                </div>
                <div className="contact-item">
                  <img src="/assets/icons/mail.svg" alt="Email" className="contact-icon" />
                  <span>Decocenter@gmail.com</span>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Redes sociales y copyright */}
            <div className="col-md-4">
              <div className="social-media">
                <a href="#" className="social-link">
                  <img src="/assets/Facebook.svg" alt="Facebook" className="social-icon" />
                </a>
                <a href="#" className="social-link">
                  <img src="/assets/Instagram.svg" alt="Instagram" className="social-icon" />
                </a>
                <a href="#" className="social-link">
                  <img src="/assets/twitter.svg" alt="Twitter" className="social-icon" />
                </a>
              </div>
              <div className="copyright">
                Copyright &#169; DECOCENTER
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
