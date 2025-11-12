import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

function Cart() {
    const { cartItems, cartTotal, removeFromCart, updateQuantity } = useAuth(); 
    
    const formattedCartTotal = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(cartTotal);

    if (cartItems.length === 0) {
        return (
            <Container className="empty-cart-container">
                <div className="empty-cart-icon mb-4">
                    <i className="fas fa-shopping-basket fa-5x text-cafe-claro"></i>
                </div>
                <h2 className="text-cafe-oscuro fw-bold mb-3">Tu Carrito Está Vacío</h2>
                <p className="lead text-texto-claro mb-4">Agrega algunos cafés premium para comenzar tu experiencia CoffeeLink.</p>
                <Button as={Link} to="/catalogo" className="btn-cafe-primary btn-lg">
                    <i className="fas fa-coffee me-2"></i> Explorar Catálogo
                </Button>
            </Container>
        );
    }

    return (
        <Container className="cart-container">
            <div className="cart-header d-flex justify-content-between align-items-center mb-5">
                 <h1 className="display-5 fw-bold text-cafe-oscuro mb-0">
                    <i className="fas fa-shopping-cart me-3"></i>
                    Tu Carrito 
                    <span className="badge bg-cafe-medio ms-2 fs-6">{cartItems.length} {cartItems.length === 1 ? 'Producto' : 'Productos'}</span>
                </h1>
                
                <Button as={Link} to="/catalogo" className="btn-outline-cafe-light">
                    <i className="fas fa-arrow-left me-2"></i> Seguir Comprando
                </Button>
            </div>
            
            <Row>
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-crema text-cafe-oscuro fw-bold">
                            <i className="fas fa-list me-2"></i>Productos en el Carrito
                        </Card.Header>
                        <ListGroup variant="flush">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.id} className="cart-item p-4">
                                    <Row className="align-items-center">
                                        <Col md={2}>
                                            <img 
                                                src={item.imagenUrl || 'https://via.placeholder.com/80x80?text=Café'} 
                                                alt={item.nombre} 
                                                className="cart-item-image rounded shadow-sm"
                                            />
                                        </Col>
                                        
                                        <Col md={4}>
                                            <h5 className="text-cafe-oscuro fw-bold mb-2">{item.nombre}</h5>
                                            <div className="product-details">
                                                <small className="text-texto-claro d-block">
                                                    <i className="fas fa-box me-1"></i>Stock: {item.stock} unidades
                                                </small>
                                                <small className="text-success fw-bold">
                                                    <i className="fas fa-tag me-1"></i>P. Unitario: ${new Intl.NumberFormat('es-CL').format(item.precio)}
                                                </small>
                                            </div>
                                        </Col>
                                        
                                        <Col md={3}>
                                            <div className="quantity-controls">
                                                <label className="form-label text-cafe-oscuro fw-bold mb-2">Cantidad:</label>
                                                <InputGroup className="cart-quantity-selector">
                                                    <Button 
                                                        variant="outline-cafe-light" 
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        disabled={item.quantity === 1}
                                                        className="quantity-btn"
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </Button>
                                                    <InputGroup.Text className="quantity-display fw-bold text-cafe-oscuro">
                                                        {item.quantity}
                                                    </InputGroup.Text>
                                                    <Button 
                                                        variant="outline-cafe-light" 
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="quantity-btn"
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </Button>
                                                </InputGroup>
                                            </div>
                                        </Col>
                                        
                                        <Col md={2} className="text-center">
                                            <div className="item-total">
                                                <span className="fw-bold text-cafe-medio fs-5">
                                                    ${new Intl.NumberFormat('es-CL').format(item.precio * item.quantity)}
                                                </span>
                                            </div>
                                        </Col>
                                        
                                        <Col md={1}>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                onClick={() => removeFromCart(item.id)}
                                                className="remove-btn"
                                                title="Eliminar del carrito"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                
                <Col md={4}>
                    <Card className="shadow-lg border-0 cart-summary">
                        <Card.Header className="bg-cafe-oscuro text-white fw-bold py-3">
                            <i className="fas fa-receipt me-2"></i>Resumen de Compra
                        </Card.Header>
                        <Card.Body className="bg-crema">
                            <div className="summary-details">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="text-cafe-oscuro fw-bold fs-5">Total ({cartItems.length} ítems):</span>
                                    <span className="text-cafe-oscuro fw-bold fs-4">{formattedCartTotal}</span>
                                </div>
                            </div>
                            
                            <Button className="btn-cafe-primary w-100 py-3 fw-bold checkout-btn" disabled>
                                <i className="fas fa-credit-card me-2"></i>
                                Proceder al Pago
                                <small className="d-block mt-1 fw-normal fs-7">Funcionalidad en desarrollo</small>
                            </Button>
                            
                            <div className="security-notice text-center mt-3">
                                <small className="text-texto-claro">
                                    <i className="fas fa-shield-alt me-1"></i>
                                    Compra 100% segura
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;