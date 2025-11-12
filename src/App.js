import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login.js';
import Catalog from './components/Catalog.js';
import AdminDashboard from './components/AdminDashboard.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Register from './components/Register.js';
import Home from './components/Home';
import { useAuth } from './context/AuthContext.js'; 
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 
import './styles/cafe-theme.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="App cafe-theme">
      <Toaster 
        position="bottom-center"
        toastOptions={{ duration: 3000 }}
      />
      
      <Navbar expand="lg" className="cafe-navbar fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
            <i className="fas fa-mug-hot me-2"></i>
            CoffeeLink
            <small className="d-block fs-6 fw-normal">Artisan Coffee</small>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/catalogo" className="text-white mx-2">Catálogo</Nav.Link>
              
              {user && user.rol === 'admin' && (
                <Nav.Link as={Link} to="/admin" className="text-white mx-2">Admin</Nav.Link>
              )}
            </Nav>
            
            <Nav>
              {user ? (
                <div className="d-flex align-items-center">
                  <Navbar.Text className="text-cafe-dorado me-3">
                    Hola, {user.email}
                  </Navbar.Text>
                  <Button className="btn-outline-cafe-light" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="d-flex">
                  <Nav.Link as={Link} to="/login" className="text-white mx-2">Ingresar</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="text-cafe-dorado mx-2">Registrarse</Nav.Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>

      <footer className="bg-cafe-oscuro text-light py-4 mt-5">
        <Container>
          <div className="text-center">
            <p className="mb-0 text-cafe-dorado">
              <i className="fas fa-mug-hot me-2"></i>
              &copy; 2025 CoffeeLink - Tu tienda de café de confianza
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;