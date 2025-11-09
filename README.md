# CoffeeLink - Frontend (React)

Esta es la interfaz (la tienda) del proyecto. Es la parte que ve el usuario.

Costó levantar esto en React desde cero, pero la **logica** principal que pedía el PDF está terminada.

## Funcionalidad
* Se usó React Router para crear las diferentes páginas (`/login`, `/catalogo`, `/admin`).
* Se creó un "cerebro" global (`AuthContext`) para guardar el token y el rol del usuario.
* Usa `localStorage` para que la sesión no se borre al refrescar la página (F5).
* Se implementó un `ProtectedRoute` (un "guardia") para la ruta `/admin`, que revisa el rol.
* Se creó un `apiClient` (Axios) para centralizar todas las llamadas al BFF (puerto 8081).

## Tech
* React.js
* React Router
* React Context
* Axios