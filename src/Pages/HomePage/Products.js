import "./styles.css";
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="epa">
        ¡Muebles a precios convenientes para renovar tu hogar!
      </h1>

      <div className="product-container">
        {/* Tarjeta 1 */}
        <div className="product-card">
          <div className="product-image">
            <img src="/assets/camas.avif" alt="Muebles para el hogar" />
          </div>
          <div className="product-info" style={{ backgroundColor: "#333333" }}>
            <h2>Muebles para todo tu hogar</h2>
            <p>
              Descubre nuestra nueva colección de muebles para el hogar y
              encuentra el estilo que mejor se adapte a tu espacio.
            </p>
            <button 
              className="hola"
              onClick={() => navigate('/store')}
              aria-label="Ver productos"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M18 12L13 7M18 12L13 17"
                  stroke="#333333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="product-card">
          <div className="product-image">
            <img src="/assets/bar.avif" alt="Muebles para pareja" />
          </div>
          <div className="product-info" style={{ backgroundColor: "#B8865B" }}>
            <h2>Muebles para él y para ella</h2>
            <p>
              Combinaciones perfectas hechas por nosotros. Encuentra ideas
              originales para cada ocasión.
            </p>
            <button 
              className="hola"
              onClick={() => navigate('/store')}
              aria-label="Ver productos"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M18 12L13 7M18 12L13 17"
                  stroke="#333333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="product-card">
          <div className="product-image">
            <img src="/assets/b.avif" alt="Taller de carpintería" />
          </div>
          <div className="product-info" style={{ backgroundColor: "#5c3a29" }}>
            <h2>Taller de carpintería de alta calidad</h2>
            <p>
              ¿Estás buscando muebles sostenibles y de alta calidad? En nuestro
              taller de carpintería encontrarás los mejores muebles.
            </p>
            <button 
              className="hola"
              onClick={() => navigate('/store')}
              aria-label="Ver productos"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M18 12L13 7M18 12L13 17"
                  stroke="#333333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
