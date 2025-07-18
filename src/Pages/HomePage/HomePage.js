import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './HomePage.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Imágenes para el carrusel y productos desde public/assets
const carouselImages = [
  '/assets/22-ABRIL-scaled-1.jpg',
  '/assets/7781eb708430bcc50d1885aee17f1c14.jpg',
  '/assets/Aline.jpeg',
];
 
// Lista de categorías (se puede extender fácilmente)
const categories = [
  'Todos',
  'Cocina',
  'Baños',
  'Closet',
  'Muebles',
  'Camas',
];

// Catálogo estático de productos de demostración (sin base de datos)
// En un futuro se puede remplazar por un fetch a tu API / base de datos.
const products = [
  {
    id: 1,
    name: 'Buró',
    description: 'Mueble de noche 2 cajones',
    category: 'Muebles',
    price: 1540,
    image: '/assets/22-ABRIL-scaled-1.jpg',
  },
  {
    id: 2,
    name: 'Estante',
    description: 'Mueble con repisas',
    category: 'Muebles',
    price: 2320,
    image: '/assets/7781eb708430bcc50d1885aee17f1c14.jpg',
  },
  {
    id: 3,
    name: 'Cómoda',
    description: 'Mueble 3 cajones',
    category: 'Muebles',
    price: 3060,
    image: '/assets/Aline.jpeg',
  },
  {
    id: 4,
    name: 'Gabinete',
    description: 'Gabinete de baño',
    category: 'Baños',
    price: 2785,
    image: '/assets/Iris.jpeg',
  },
  {
    id: 5,
    name: 'Isla de Cocina',
    description: 'Isla central con madera',
    category: 'Cocina',
    price: 4800,
    image: '/assets/Mich.jpeg',
  },
];

function HomePage({ userEmail, onLogout }) {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts =
    selectedCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const formatCurrency = (value) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });

  return (
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold" style={{ cursor: 'pointer' }}>
            Diseño Interior
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <span className="nav-link active" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                  Inicio
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/store')}>
                  Tienda
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>
                  Contáctenos
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/promotions')}>
                  Promociones
                </span>
              </li>
            </ul>
            <button className="btn position-relative me-3" onClick={() => navigate('/cart')}>
              <i className="bi bi-cart3 fs-5"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              )}
            </button>
            <span className="me-3 text-muted d-none d-lg-block">{userEmail}</span>
            <button className="btn btn-outline-secondary" onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero container text-center my-5">
        <h2 className="mb-4 fw-bold">Los mejores diseños de interiores del mundo</h2>
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
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

      {/* CATEGORY FILTER */}
      <div className="container mb-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${
                selectedCategory === cat ? 'btn-dark' : 'btn-outline-dark'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="container pb-5">
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <div className="card h-100 shadow-sm" style={{cursor:'pointer'}} onClick={() => navigate(`/product/${product.id}`)}>
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: 'cover', height: '180px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold mb-1">{product.name}</h6>
                  <p className="card-text text-muted small mb-2">
                    {product.description}
                  </p>
                  <p className="fw-bold mb-4">{formatCurrency(product.price)}</p>
                  <div className="mt-auto d-flex gap-2 justify-content-between">
                    <button className="btn btn-outline-primary btn-sm w-100" onClick={() => navigate(`/product/${product.id}`)}>
                      <i className="bi bi-cart3 me-1"></i>Añadir
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-light py-5 mt-auto">
        <div className="container text-center">
          <p className="fw-bold mb-1">Los mejores diseños de interiores del mundo</p>
          <p className="text-muted small">
            Sal de lo común y recorre lugares inesperados y novedosos. Aquí está nuestra guía
            definitiva de los mejores lugares secretos que debes visitar.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="#" className="text-decoration-none text-dark">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-decoration-none text-dark">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-decoration-none text-dark">
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
