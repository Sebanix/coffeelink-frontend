import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login.js';
import Catalog from './components/Catalog.js';
import AdminDashboard from './components/AdminDashboard.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Register from './components/Register.js';
import Home from './components/Home';
import Cart from './components/Cart.js'; 
import { useAuth } from './context/AuthContext.js'; 
import { Toaster } from 'react-hot-toast';
import './styles/cafe-theme.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function App() {
  const { user, logout, cartItems, cartTotal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const formattedCartTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(cartTotal);

  return (
    <div className="App cafe-theme d-flex flex-column min-vh-100">
      <Toaster 
        position="bottom-center"
        toastOptions={{ duration: 3000 }}
      />
      
      <Navbar expand="lg" className="cafe-navbar fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
            <i className="fas fa-mug-hot me-2"></i>
            CoffeeLink
            <small className="d-block fs-6 fw-normal">Un enlace a un buen café</small>
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
              {user && user.rol === 'cliente' && (
                <Nav.Link 
                  as={Link} 
                  to="/carrito"
                  className="text-white me-3 cart-link"
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  Carrito ({totalItems}) | Total: <span className="text-cafe-dorado fw-bold">{formattedCartTotal}</span>
                </Nav.Link>
              )}

              {user ? (
                <div className="d-flex align-items-center">
                  <Navbar.Text className="text-cafe-dorado me-3">
                    <i className="fas fa-user me-1"></i>
                    Hola, {user.email}
                  </Navbar.Text>
                  <Button 
                    className="btn-outline-cafe-light" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="d-flex">
                  <Nav.Link as={Link} to="/login" className="text-white mx-2">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Ingresar
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="text-cafe-dorado mx-2">
                    <i className="fas fa-user-plus me-1"></i>
                    Registrarse
                  </Nav.Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<Cart />} />
        </Routes>
      </main>

      <footer className="bg-cafe-oscuro text-light py-4 mt-auto">
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