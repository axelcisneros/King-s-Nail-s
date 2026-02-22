import axios from 'axios';

// Usar ruta relativa permite que Vite proxy pase las peticiones al backend
// y así las cookies se consideren same-site en desarrollo.
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TUNNEL_API_BASE_URL = import.meta.env.VITE_TUNNEL_API_BASE_URL;
if (typeof window !== 'undefined') {
  const host = window.location.host;
  // Si estamos accediendo vía dominio devtunnels y se definió URL túnel del backend, usarla.
  if (host.includes('devtunnels.ms') && TUNNEL_API_BASE_URL) {
    API_BASE_URL = TUNNEL_API_BASE_URL;
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  // Permite que el navegador envíe cookies en las peticiones a la API
  withCredentials: true,
});

// Interceptor para manejar 401: intentar refresh y reintentar la petición original una vez
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Si no hay response o no es 401, delegar el error
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // No intentar refresh si la petición original ya fue reintentada
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Evitar intentar refresh cuando la petición que falló ya es la propia ruta de refresh
    const requestUrl = originalRequest.url || '';
    if (requestUrl.includes('/users/refresh')) {
      return Promise.reject(error);
    }

    // Lista de rutas que NO deberían intentar refresh automático
    const noRefreshRoutes = [
      '/users/profile',
      '/users/login',
      '/users/register',
      '/services', // Rutas públicas
      '/gallery',
      '/reviews'
    ];

    // Si es una ruta que no debería hacer refresh automático, rechazar directamente
    if (noRefreshRoutes.some(route => requestUrl.includes(route))) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Consolidar múltiples 401 concurrentes: una sola petición de refresh sharedPromise
    if (!api._refreshTokenPromise) {
      api._refreshTokenPromise = api.post('/users/refresh').finally(() => {
        api._refreshTokenPromise = null;
      });
    }

    try {
      await api._refreshTokenPromise;
      return api(originalRequest);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  }
);

export default api;