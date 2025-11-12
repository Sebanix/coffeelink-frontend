import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast'; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`"${product.nombre}" (x${existingItem.quantity + 1}) agregado.`);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      toast.success(`"${product.nombre}" agregado al carrito.`);
    }
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(currentItems => {
        const itemIndex = currentItems.findIndex(item => item.id === productId);

        if (itemIndex === -1) return currentItems;

        const updatedItems = [...currentItems];
        const currentQuantity = updatedItems[itemIndex].quantity;
        const product = updatedItems[itemIndex];
        const newQuantity = currentQuantity + delta;

        if (newQuantity <= 0) {
            toast.success(`"${product.nombre}" eliminado del carrito.`);
            return currentItems.filter(item => item.id !== productId);
        }
        
        if (newQuantity > product.stock) {
             toast.error(`Stock máximo para ${product.nombre} alcanzado: ${product.stock}`);
             return currentItems; 
        }

        updatedItems[itemIndex] = { ...product, quantity: newQuantity };
        return updatedItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(currentItems => {
        const itemToRemove = currentItems.find(item => item.id === productId);
        if (itemToRemove) {
            toast.success(`"${itemToRemove.nombre}" eliminado del carrito.`);
        }
        return currentItems.filter(item => item.id !== productId);
    });
  };
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.precio * item.quantity,
    0
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); 
    }
    setLoading(false); 
  }, []); 

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCartItems([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading: loading,
    cartItems,
    addToCart,
    cartTotal,
    removeFromCart, 
    updateQuantity,
  };

  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}