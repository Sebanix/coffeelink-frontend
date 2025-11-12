import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="cafe-home">
      <section className="hero-section d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content text-white">
                <h1 className="display-4 fw-bold mb-4">
                  El Arte del <span className="text-cafe-dorado">Café</span>
                </h1>
                <p className="lead mb-4">
                  Descubre nuestros granos premium seleccionados de las mejores regiones del mundo. 
                  Cada taza es una experiencia única de sabores y aromas.
                </p>
                <Link to="/catalogo" className="btn btn-cafe-primary btn-lg">
                  Explorar Cafés <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="certification-card text-center">
                <div className="expert-image mb-4">
                  <img 
                    src="/hiroaki.jpg" 
                    alt="Hiroaki Nitta - Catador Certificador"
                    className="expert-photo"
                  />
                </div>
                
                <div className="certification-content">
                  <h4 className="text-cafe-dorado fw-bold mb-3">
                    <i className="fas fa-award me-2"></i>
                    Certificación Premium
                  </h4>
                  
                  <div className="certification-badge mb-3">
                    <div className="badge-content bg-white rounded p-3 shadow-sm">
                      <p className="text-cafe-oscuro mb-2 fw-bold">
                        "Excelencia en cada grano"
                      </p>
                      <small className="text-texto-claro">
                        Certificado por el reconocido catador
                      </small>
                    </div>
                  </div>
                  
                  <h5 className="text-white fw-bold mb-1">Hiroaki Nitta</h5>
                  <p className="text-cafe-dorado small mb-3">
                    Master Catador & Coffee Consultant
                  </p>
                  
                  <div className="expert-stats">
                    <div className="row text-white">
                      <div className="col-4">
                        <div className="stat-number">15+</div>
                        <small>Años de experiencia</small>
                      </div>
                      <div className="col-4">
                        <div className="stat-number">500+</div>
                        <small>Cafés evaluados</small>
                      </div>
                      <div className="col-4">
                        <div className="stat-number">98%</div>
                        <small>Satisfacción</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;