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
    setImagenUrl(''); // Limpia la URL
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
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{editingId ? `Editando Producto (ID: ${editingId})` : 'Crear Producto'}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción:</Form.Label>
                  <Form.Control as="textarea" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Group>
                
                {/* --- ¡NUEVO CAMPO DE FORMULARIO! --- */}
                <Form.Group className="mb-3">
                  <Form.Label>URL de Imagen:</Form.Label>
                  <Form.Control type="text" placeholder="https://..." value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Precio (CLP):</Form.Label>
                  <Form.Control type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock:</Form.Label>
                  <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </Form.Group>
                
                <Button variant="primary" type="submit" className="w-100">
                  {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                </Button>
                {editingId && (
                  <Button variant="secondary" onClick={resetForm} className="w-100 mt-2">
                    Cancelar Edición
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <h2>Gestionar Productos</h2>
          {loading ? (
             <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
              </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
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
                      <td>{product.id}</td>
                      <td>{product.nombre}</td>
                      <td>${new Intl.NumberFormat('es-CL').format(product.precio)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEditClick(product)} className="me-2">
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <Pagination className="justify-content-center">
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                />
                <Pagination.Item active>{currentPage + 1}</Pagination.Item>
                {totalPages > 1 && (
                  <>
                    <Pagination.Ellipsis disabled />
                    <Pagination.Item onClick={() => handlePageChange(totalPages - 1)}>
                      {totalPages}
                    </Pagination.Item>
                  </>
                )}
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage + 1 >= totalPages}
                />
              </Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;