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
import Card from 'react-bootstrap/Card';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!nombre.trim()) {
      toast.error("Por favor, ingresa tu nombre completo.");
      return false;
    }
    
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
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      toast.error("La contraseña debe tener al menos un símbolo (ej. !@#$).");
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await apiClient.post('/register', { 
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(), 
        password 
      });
      
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login', { 
        state: { message: 'Cuenta creada exitosamente. Por favor inicia sesión.' } 
      });
      
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error('Este email ya está registrado.');
      } else if (err.response && err.response.status === 400) {
        if (err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Datos inválidos. Revisa el formulario.');
        }
      } else {
        toast.error('Error del servidor. Intenta nuevamente.');
      }
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return { strength: 0, text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength++;
    
    const strengthText = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte', 'Muy fuerte'][strength];
    const strengthColor = ['danger', 'danger', 'warning', 'info', 'success', 'success'][strength];
    
    return { strength: (strength / 5) * 100, text: strengthText, color: strengthColor };
  };

  const passwordInfo = passwordStrength();

  return (
    <Container className="auth-page">
      <Row className="justify-content-center align-items-center min-vh-50">
        <Col md={6} lg={5} xl={4}>
          <Card className="shadow-lg border-0 login-card">
            <Card.Header className="bg-cafe-oscuro text-white text-center py-4">
              <h3 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Unirse a CoffeeLink
              </h3>
              <p className="mb-0 mt-2 text-cafe-dorado">Crea tu cuenta</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label className="fw-bold text-cafe-oscuro">
                    <i className="fas fa-user me-2"></i>Nombre Completo
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ingresa tu nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="border-cafe-claro py-2"
                  />
                </Form.Group>

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

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="fw-bold text-cafe-oscuro">
                    <i className="fas fa-lock me-2"></i>Contraseña
                  </Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Crea una contraseña segura"
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
                  
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className={`progress-bar bg-${passwordInfo.color}`}
                          style={{ width: `${passwordInfo.strength}%` }}
                        ></div>
                      </div>
                      <small className={`text-${passwordInfo.color}`}>
                        Fortaleza: {passwordInfo.text}
                      </small>
                    </div>
                  )}
                  
                  <Form.Text className="text-muted small">
                    Mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                  <Form.Label className="fw-bold text-cafe-oscuro">
                    <i className="fas fa-lock me-2"></i>Confirmar Contraseña
                  </Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-cafe-claro py-2"
                    />
                    <Button 
                      variant="outline-cafe-light" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="border-cafe-claro"
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </Button>
                  </InputGroup>
                  
                  {confirmPassword && password !== confirmPassword && (
                    <Form.Text className="text-danger small">
                      Las contraseñas no coinciden.
                    </Form.Text>
                  )}
                  
                  {confirmPassword && password === confirmPassword && (
                    <Form.Text className="text-success small">
                      <i className="fas fa-check me-1"></i>Las contraseñas coinciden.
                    </Form.Text>
                  )}
                </Form.Group>
                
                <Button 
                  type="submit" 
                  className="btn-cafe-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Crear Cuenta
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-texto-claro mb-2">
                  ¿Ya tienes cuenta en CoffeeLink?
                </p>
                <Link 
                  to="/login" 
                  className="btn btn-outline-cafe-light w-100"
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Iniciar Sesión
                </Link>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <small className="text-texto-claro">
              <i className="fas fa-shield-alt me-1"></i>
              Tus datos están protegidos y seguros
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;