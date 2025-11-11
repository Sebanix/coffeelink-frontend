import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, ingresa un email válido.");
      return false;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("La contraseña debe tener al menos una minúscula.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("La contraseña debe tener al menos una mayúscula.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("La contraseña debe tener al menos un número.");
      return false;
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,./?]/.test(password)) {
      toast.error("La contraseña debe tener al menos un símbolo (ej. !@#$).");
      return false;
    }
    return true; 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return; 
    }
    try {
      await apiClient.post('/register', { nombre, email, password });
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login'); 
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error(err.response.data); 
      } else if (err.response && err.response.status === 400) {
        toast.error('Datos inválidos. Revisa el formulario.');
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Crear Cuenta</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  title="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo."
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Button>
              </InputGroup>
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100">
              Crear Cuenta
            </Button>
          </Form>
          <div className="text-center mt-3">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;