import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    const loginUrl = 'http://localhost:8081/api/login';

    try {
      const response = await axios.post(loginUrl, {
        email: email,
        password: password
      });

      console.log('Login exitoso!', response.data);
      
      const userData = { email: email, rol: response.data.rol };
      const authToken = response.data.token;
      login(userData, authToken);

      setMessage('¡Login exitoso! Redirigiendo...');

    } catch (error) {
      console.error('Error en el login:', error.response.data);
      setMessage('Error: ' + error.response.data);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión en CoffeeLink</h2>
      <form onSubmit={handleSubmit}>
         <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;