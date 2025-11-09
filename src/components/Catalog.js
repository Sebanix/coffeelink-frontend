import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchProducts = async () => {
      const productsUrl = '/productos'; 
      
      try {
        setLoading(true);
        const response = await apiClient.get(productsUrl); 
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar productos. ¿El BFF está corriendo?');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (productId) => {
    
    const buyUrl = `/comprar/${productId}`;

    try {
      const response = await apiClient.post(
        buyUrl,
        { cantidad: 1 } 
      );

      alert('¡Compra exitosa! Pedido creado: Nro ' + response.data.id);
      
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert('Error: ¡No hay stock suficiente de este producto!');
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        alert('Error: Tu sesión es inválida o no tienes permisos. Por favor, vuelve a iniciar sesión.');
      } else {
        alert('Ocurrió un error inesperado al comprar.');
      }
      console.error(err);
    }
  }; 

  if (loading) {
    return <p>Cargando cafés...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Nuestro Catálogo de Cafés</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
            <h3>{product.nombre}</h3>
            <p>{product.descripcion}</p>
            <p><strong>Precio:</strong> ${product.precio}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            
            <button onClick={() => handleBuy(product.id)}>
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;