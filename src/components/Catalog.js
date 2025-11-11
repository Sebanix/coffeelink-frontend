import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { toast } from 'react-hot-toast';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  
  const pageSize = 9; 

  const fetchProducts = useCallback(async (page = 0, params = {}) => {
    const productsUrl = '/productos';
    try {
      setLoading(true);
      const allParams = { ...params, page: page, size: pageSize, sort: 'id,asc' };
      const response = await apiClient.get(productsUrl, { params: allParams });
      setProducts(response.data.content); 
      setTotalPages(response.data.totalPages); 
      setCurrentPage(response.data.number); 
      setLoading(false);
    } catch (err) {
      setError('Error al cargar productos. Por favor, intenta nuevamente más tarde.');
      setLoading(false);
      console.error(err);
    }
  }, [pageSize]); 

  useEffect(() => {
    fetchProducts(); 
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault(); 
    setCurrentPage(0); 
    fetchProducts(0, {
      nombre: searchTerm || null,
      precioMin: minPrice || null,
      precioMax: maxPrice || null
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(0);
    fetchProducts(); 
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchProducts(newPage, {
        nombre: searchTerm || null,
        precioMin: minPrice || null,
        precioMax: maxPrice || null
      });
    }
  };

  const handleBuy = async (productId) => {
    const buyUrl = `/comprar/${productId}`;
    try {
      const response = await apiClient.post(buyUrl, { cantidad: 1 });
      toast.success('¡Compra exitosa! Pedido creado: Nro ' + response.data.id);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error('Error: ¡No hay stock suficiente de este producto!');
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast.error('Error: Tu sesión es inválida o no tienes permisos. Por favor, vuelve a iniciar sesión.');
      } else {
        toast.error('Ocurrió un error inesperado al comprar.');
      }
    }
  }; 

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando cafés...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Nuestro Catálogo de Cafés</h2>
      
      <Form onSubmit={handleSearch} className="p-3 mb-4" style={{ border: '1px solid #ddd', borderRadius: '8px', background: '#f8f9fa' }}>
        <Row className="g-2 align-items-end">
          <Col md={5}>
            <Form.Label>Buscar por Nombre</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ej: Etiopía Yirgacheffe" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Precio Mín.</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="CLP $" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Precio Máx.</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="CLP $" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Button type="submit" className="w-100">Buscar</Button>
            <Button variant="secondary" type="button" onClick={clearFilters} className="w-100 mt-2">Limpiar</Button>
          </Col>
        </Row>
      </Form>

      <Row>
        {products.length === 0 ? (
          <Col>
            <p>No se encontraron productos con esos filtros.</p>
          </Col>
        ) : (
          products.map(product => (
            <Col md={4} lg={3} className="mb-4" key={product.id}>
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={product.imagenUrl || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text style={{ minHeight: '60px' }}>
                    {product.descripcion}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    ${new Intl.NumberFormat('es-CL').format(product.precio)}
                  </Card.Subtitle>
                  <Card.Text>
                    <small>Stock: {product.stock}</small>
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleBuy(product.id)} 
                    disabled={product.stock === 0}
                    className="mt-auto"
                  >
                    {product.stock === 0 ? 'Sin Stock' : 'Comprar'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      
      <Row className="justify-content-center mt-3">
        <Col md="auto">
          <Pagination>
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            />
            
            {[...Array(totalPages).keys()].map(pageNumber => (
              <Pagination.Item 
                key={pageNumber} 
                active={pageNumber === currentPage}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages}
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default Catalog;