import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Login from './components/Login.js';
import Catalog from './components/Catalog.js';
import AdminDashboard from './components/AdminDashboard.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import { useAuth } from './context/AuthContext.js'; 

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="App">
      <nav style={{ padding: '10px', background: '#eee' }}>
        <Link to="/catalogo" style={{ marginRight: '10px' }}>Catálogo</Link>
        
        {user && user.rol === 'admin' && (
          <Link to="/admin" style={{ marginRight: '10px' }}>Admin</Link>
        )}

        <div style={{ float: 'right' }}>
          {user ? (
            <>
              <span style={{ marginRight: '10px' }}>Hola, {user.email}</span>
              <button onClick={handleLogout}>
                Cerrar Sesión (Logout)
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <h1 style={{ padding: '20px' }}>Bienvenido a CoffeeLink</h1>

      <Routes>
        <Route path="/login" element={<Login />} />
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