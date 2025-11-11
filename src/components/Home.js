import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="cafe-home">
      <section className="hero-section min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content text-white">
                <h1 className="display-4 fw-bold mb-4">
                  El Arte del <span className="text-cafe-dorado">Café</span>
                </h1>
                <p className="lead mb-4">
                  Descubre nuestros granos premium seleccionados de las mejores regiones.
                </p>
                <Link to="/catalogo" className="btn btn-cafe-primary btn-lg">
                  Explorar Cafés <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;