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
  
  if (searchTerm && /[áéíóúÁÉÍÓÚ]/.test(searchTerm)) {
    toast('💡 Tip: Para mejores resultados, busca sin tildes (ej: "cafe" en lugar de "café")', {
      duration: 4000,
    });
  }
  
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
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" role="status" className="text-cafe-medio" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3 text-texto-claro">Cargando nuestros cafés premium...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5 pt-5">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-cafe-oscuro mb-3">Nuestro Catálogo Premium</h1>
        <p className="lead text-texto-claro">Descubre la selección más exclusiva de cafés de origen único</p>
      </div>
      
      <Card className="shadow-sm border-0 mb-5">
        <Card.Header className="bg-cafe-oscuro text-white">
          <h5 className="mb-0"><i className="fas fa-search me-2"></i>Buscar Cafés</h5>
        </Card.Header>
        <Card.Body className="bg-crema">
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md={5}>
                <Form.Label className="fw-bold text-cafe-oscuro">Buscar por Nombre</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ej: Etiopía Yirgacheffe, Colombia Supremo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-cafe-claro"
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-bold text-cafe-oscuro">Precio Mín.</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="$ CLP" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="border-cafe-claro"
                />
              </Col>
              <Col md={2}>
                <Form.Label className="fw-bold text-cafe-oscuro">Precio Máx.</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="$ CLP" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="border-cafe-claro"
                />
              </Col>
              <Col md={3}>
                <Button type="submit" className="btn-cafe-primary w-100">
                  <i className="fas fa-search me-2"></i>Buscar
                </Button>
                <Button variant="outline-cafe-light" type="button" onClick={clearFilters} className="w-100 mt-2">
                  <i className="fas fa-times me-2"></i>Limpiar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search fa-4x text-cafe-claro mb-3"></i>
          <h4 className="text-cafe-oscuro">No se encontraron productos</h4>
          <p className="text-texto-claro">Intenta con otros términos de búsqueda o ajusta los filtros</p>
        </div>
      ) : (
        <Row>
          {products.map(product => (
            <Col md={6} lg={4} className="mb-4" key={product.id}>
              <Card className="h-100 product-card shadow-sm border-0">
                <div className="card-img-wrapper position-relative overflow-hidden">
                  <Card.Img 
                    variant="top" 
                    src={product.imagenUrl || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} 
                    className="product-image"
                  />
                  {product.stock === 0 && (
                    <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small">
                      <i className="fas fa-times me-1"></i>Sin Stock
                    </div>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="product-category small text-cafe-claro mb-2 text-uppercase">
                    <i className="fas fa-tag me-1"></i>Café Premium
                  </div>
                  <Card.Title className="fw-bold text-cafe-oscuro">{product.nombre}</Card.Title>
                  <Card.Text className="flex-grow-1 text-texto-claro small" style={{ minHeight: '60px' }}>
                    {product.descripcion}
                  </Card.Text>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="h5 text-cafe-medio fw-bold mb-0">
                      ${new Intl.NumberFormat('es-CL').format(product.precio)}
                    </span>
                    <span className={`badge ${product.stock > 10 ? 'bg-verde-cafe' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                      <i className="fas fa-box me-1"></i>{product.stock} unidades
                    </span>
                  </div>
                  
                  <Button 
                    className={`mt-auto ${product.stock > 0 ? 'btn-cafe-primary' : 'btn-secondary'}`}
                    onClick={() => handleBuy(product.id)} 
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? (
                      <><i className="fas fa-times me-2"></i>Agotado</>
                    ) : (
                      <><i className="fas fa-shopping-cart me-2"></i>Comprar Ahora</>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {totalPages > 1 && (
        <Row className="justify-content-center mt-5">
          <Col md="auto">
            <Pagination>
              <Pagination.Prev 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="page-cafe"
              />
              
              {[...Array(totalPages).keys()].map(pageNumber => (
                <Pagination.Item 
                  key={pageNumber} 
                  active={pageNumber === currentPage}
                  onClick={() => handlePageChange(pageNumber)}
                  className={pageNumber === currentPage ? 'bg-cafe-medio border-cafe-medio' : 'text-cafe-oscuro'}
                >
                  {pageNumber + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                className="page-cafe"
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Catalog;