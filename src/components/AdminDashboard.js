import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { toast } from 'react-hot-toast';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

function AdminDashboard() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagenUrl, setImagenUrl] = useState(''); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const fetchProducts = useCallback(async (page = 0) => {
    const productsUrl = '/productos';
    try {
      setLoading(true);
      const params = { page: page, size: pageSize, sort: 'id,asc' };
      const response = await apiClient.get(productsUrl, { params });
      setProducts(response.data.content); 
      setTotalPages(response.data.totalPages); 
      setCurrentPage(response.data.number); 
      setLoading(false);
    } catch (err) {
      console.error("Error cargando productos", err);
      toast.error("Error al cargar la lista de productos.");
      setLoading(false);
    }
  }, [pageSize]); 

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product) => {
    setNombre(product.nombre);
    setDescripcion(product.descripcion);
    setPrecio(product.precio);
    setStock(product.stock);
    setImagenUrl(product.imagenUrl || ''); 
    setEditingId(product.id); 
    toast.success(`Editando: ${product.nombre}`);
    window.scrollTo(0, 0); 
  };
  
  const resetForm = () => {
    setEditingId(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setImagenUrl('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const priceNum = parseFloat(precio);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || isNaN(stockNum)) {
      toast.error('Error: El precio y el stock deben ser números válidos.');
      return;
    }
    if (!Number.isInteger(priceNum) || !Number.isInteger(stockNum)) {
      toast.error('Error: El precio y el stock deben ser números enteros (sin decimales).');
      return;
    }
    if (priceNum <= 0 || stockNum < 0) {
      toast.error('Error: El precio debe ser mayor a 0 y el stock no puede ser negativo.');
      return;
    }
    
    const productData = { nombre, descripcion, precio: priceNum, stock: stockNum, imagenUrl };
    
    try {
      if (editingId) {
        const updateUrl = `/productos/${editingId}`;
        await apiClient.put(updateUrl, productData); 
        toast.success(`¡Éxito! Producto "${productData.nombre}" actualizado.`);
      } else {
        const createUrl = '/productos';
        const response = await apiClient.post(createUrl, productData); 
        toast.success(`¡Éxito! Producto "${response.data.nombre}" creado.`);
      }

      resetForm();
      fetchProducts(currentPage); 
      
    } catch (err) {
      if (err.response && err.response.status === 400) {
        let errorMsg = 'Error de validación del backend.';
        if (err.response.data && err.response.data.errors) {
            errorMsg = err.response.data.errors[0].defaultMessage;
        } else if (typeof err.response.data === 'string') {
            errorMsg = err.response.data;
        }
        toast.error(errorMsg);
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast.error('Error: No tienes permisos de Admin. Vuelve a iniciar sesión.');
      } else {
        toast.error('Error al guardar el producto.');
      }
      console.error(err);
    }
  };
  
  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      await apiClient.delete(`/productos/${productId}`);
      toast.success('Producto eliminado con éxito.');
      fetchProducts(currentPage);
    } catch (err) {
      toast.error('Error al eliminar el producto. ¿Quizás tiene pedidos asociados?');
      console.error(err);
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchProducts(newPage);
    }
  };

  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-cafe-oscuro mb-3">
          <i className="fas fa-cog me-2"></i>
          Panel de Administración
        </h1>
        <p className="lead text-texto-claro">Gestiona los productos de CoffeeLink</p>
      </div>

      <Row>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-cafe-oscuro text-white py-3">
              <h5 className="mb-0">
                <i className="fas fa-plus me-2"></i>
                {editingId ? `Editando Producto` : 'Crear Producto'}
              </h5>
            </Card.Header>
            <Card.Body className="bg-crema">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-cafe-oscuro">Nombre:</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    required 
                    className="border-cafe-claro"
                    placeholder="Nombre del producto"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-cafe-oscuro">Descripción:</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    className="border-cafe-claro"
                    placeholder="Descripción del producto"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-cafe-oscuro">URL de Imagen:</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="https://..." 
                    value={imagenUrl} 
                    onChange={(e) => setImagenUrl(e.target.value)} 
                    className="border-cafe-claro"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-cafe-oscuro">Precio (CLP):</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={precio} 
                    onChange={(e) => setPrecio(e.target.value)} 
                    required 
                    className="border-cafe-claro"
                    placeholder="Precio en pesos chilenos"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-cafe-oscuro">Stock:</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                    className="border-cafe-claro"
                    placeholder="Cantidad disponible"
                  />
                </Form.Group>
                
                <Button variant="cafe-primary" type="submit" className="w-100 btn-cafe-primary">
                  {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                </Button>
                
                {editingId && (
                  <Button variant="outline-cafe-light" onClick={resetForm} className="w-100 mt-2">
                    Cancelar Edición
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-cafe-medio text-white py-3">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista de Productos
              </h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status" className="text-cafe-medio">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p className="mt-2 text-texto-claro">Cargando productos...</p>
                </div>
              ) : (
                <>
                  <Table striped bordered hover responsive className="mb-0">
                    <thead className="bg-crema">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="fw-bold text-cafe-oscuro">{product.id}</td>
                          <td>{product.nombre}</td>
                          <td className="text-success fw-bold">${new Intl.NumberFormat('es-CL').format(product.precio)}</td>
                          <td>
                            <span className={`badge ${product.stock > 10 ? 'bg-verde-cafe' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                              {product.stock} unidades
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="outline-warning" 
                              size="sm" 
                              onClick={() => handleEditClick(product)} 
                              className="me-2"
                            >
                              <i className="fas fa-edit me-1"></i>Editar
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDelete(product.id)}
                            >
                              <i className="fas fa-trash me-1"></i>Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  {totalPages > 1 && (
                    <div className="mt-3">
                      <Pagination className="justify-content-center mb-0">
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
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;