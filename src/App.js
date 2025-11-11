import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login.js';
import Catalog from './components/Catalog.js';
import AdminDashboard from './components/AdminDashboard.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Register from './components/Register.js';
import { useAuth } from './context/AuthContext.js'; 
import { Toaster } from 'react-hot-toast';

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
    <div className="App">
      <Toaster 
        position="bottom-center"
        toastOptions={{ duration: 3000 }}
      />
      
      <Navbar expand="lg" className="mb-4" style={{ backgroundColor: '#d7ccc8' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold' }}>
            ☕ CoffeeLink
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/catalogo">Catálogo</Nav.Link>
              
              {user && user.rol === 'admin' && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              )}
            </Nav>
            
            <Nav>
              {user ? (
                <>
                  <Navbar.Text className="me-2">
                    Hola, {user.email}
                  </Navbar.Text>
                  <Button variant="dark" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
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
        <Route path="/" element={<Catalog />} />
      </Routes>
    </div>
  );
}

export default App;