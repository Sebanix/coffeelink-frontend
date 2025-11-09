import React, { useState, useEffect } from 'react'; 
import apiClient from '../services/apiClient';

function AdminDashboard() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  

  const fetchProducts = async () => {
    const productsUrl = '/productos'; 
    try {
      const response = await apiClient.get(productsUrl);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando productos", err);
      setMessage("Error al cargar la lista de productos.");
    }
  };

  const handleEditClick = (product) => {
  setNombre(product.nombre);
  setDescripcion(product.descripcion);
  setPrecio(product.precio);
  setStock(product.stock);

  setEditingId(product.id); 

  setMessage(`Editando: ${product.nombre}`);
  window.scrollTo(0, 0);
};

  useEffect(() => {
    fetchProducts();
  }, []);

const handleSubmit = async (event) => {
  event.preventDefault();

  if (precio <= 0 || stock < 0) {
    setMessage('Error: El precio debe ser mayor a 0 y el stock no puede ser negativo.');
    return;
  }

  const productData = { nombre, descripcion, precio, stock };

  try {
    if (editingId) {
      const updateUrl = `/productos/${editingId}`;
      await apiClient.put(updateUrl, productData); 
      setMessage(`¡Éxito! Producto "${productData.nombre}" actualizado.`);

    } else {
      const createUrl = '/productos';
      const response = await apiClient.post(createUrl, productData); 
      setMessage(`¡Éxito! Producto "${response.data.nombre}" creado.`);
    }

    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setStock(0);
    setEditingId(null); 
    fetchProducts();

  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      setMessage('Error: No tienes permisos de Admin. Vuelve a iniciar sesión.');
    } else {
      setMessage('Error al guardar el producto.');
    }
    console.error(err);
  }
};
  
  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    
    try {
      await apiClient.delete(`/productos/${productId}`);
      
      setMessage('Producto eliminado con éxito.');
      fetchProducts(); 
      
    } catch (err) {
      setMessage('Error al eliminar el producto.');
      console.error(err);
    }
  };

return (
  <div>
    <h2>{editingId ? `Editando Producto (ID: ${editingId})` : 'Panel de Administrador - Crear Producto'}</h2>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', border: '1px solid #eee', padding: '10px' }}>
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Descripción:</label>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>
      <div>
        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
      </div>

      <button type="submit" style={{ marginTop: '10px' }}>
        {editingId ? 'Actualizar Producto' : 'Crear Producto'}
      </button>

      {editingId && (
        <button type="button" onClick={() => {
          setEditingId(null);
          setNombre('');
          setDescripcion('');
          setPrecio(0);
          setStock(0);
          setMessage('');
        }} style={{ marginTop: '5px' }}>
          Cancelar Edición
        </button>
      )}
    </form>

    {message && <p>{message}</p>}

    <hr style={{ margin: '20px 0' }} />
    <h2>Gestionar Productos</h2>
    {loading ? (
      <p>Cargando lista de productos...</p>
    ) : (
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.nombre}</td>
              <td>${product.precio}</td>
              <td>{product.stock}</td>
              <td>
                <button style={{ marginRight: '5px' }} onClick={() => handleEditClick(product)}>
                  Editar
                </button>
                <button style={{ color: 'red' }} onClick={() => handleDelete(product.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}

export default AdminDashboard;