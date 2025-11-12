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
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setLoading(true);
    
    try {
      const response = await apiClient.post('/login', {
        email: email,
        password: password
      });

      const userData = { email: email, rol: response.data.rol };
      const authToken = response.data.token;
      login(userData, authToken); 

      toast.success('¡Bienvenido a CoffeeLink! ☕');
      
      if (response.data.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/catalogo');
      }

    } catch (error) {
      toast.error('Credenciales incorrectas. Por favor, verifica tu email y contraseña.'); 
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 pt-4">
      <Row className="justify-content-center align-items-center min-vh-50">
        <Col md={6} lg={5} xl={4}>
          <Card className="shadow-lg border-0 login-card">
            <Card.Header className="bg-cafe-oscuro text-white text-center py-4">
              <h3 className="mb-0">
                <i className="fas fa-mug-hot me-2"></i>
                Bienvenido a CoffeeLink
              </h3>
              <p className="mb-0 mt-2 text-cafe-dorado">Inicia sesión en tu cuenta</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="fw-bold text-cafe-oscuro">
                    <i className="fas fa-envelope me-2"></i>Email
                  </Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="tu.email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-cafe-claro py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="fw-bold text-cafe-oscuro">
                    <i className="fas fa-lock me-2"></i>Contraseña
                  </Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-cafe-claro py-2"
                    />
                    <Button 
                      variant="outline-cafe-light" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-cafe-claro"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>
                
                <Button 
                  type="submit" 
                  className="btn-cafe-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-texto-claro mb-2">
                  ¿Primera vez en CoffeeLink?
                </p>
                <Link 
                  to="/register" 
                  className="btn btn-outline-cafe-light w-100"
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Crear Cuenta
                </Link>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <small className="text-texto-claro">
              <i className="fas fa-shield-alt me-1"></i>
              Tus datos están protegidos
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;