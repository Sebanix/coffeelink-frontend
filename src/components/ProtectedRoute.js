import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ requiredRole }) {
  const { user, isLoading } = useAuth(); 

  if (isLoading) {
    return <p>Verificando permisos...</p>;
  }

  if (!isLoading && user && user.rol === requiredRole) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;