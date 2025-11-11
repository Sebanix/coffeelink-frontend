import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup'; // ¡Importado!

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ¡Añadido!
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    
    try {
      const response = await apiClient.post('/login', {
        email: email,
        password: password
      });

      const userData = { email: email, rol: response.data.rol };
      const authToken = response.data.token;
      login(userData, authToken); 

      toast.success('¡Login exitoso!');
      
      if (response.data.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/catalogo');
      }

    } catch (error) {
      toast.error('Error: Credenciales inválidas'); 
      console.error(error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          <Form onSubmit={handleSubmit}>
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

            {/* --- SECCIÓN DE CONTRASEÑA ACTUALIZADA --- */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Button>
              </InputGroup>
            </Form.Group>
            {/* ------------------------------------------- */}
            
            <Button variant="primary" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
          <div className="text-center mt-3">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;