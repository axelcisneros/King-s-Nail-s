import api from '../config/api';

// Cache para evitar múltiples peticiones simultáneas
let servicesCache = null;
let servicesPromise = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const getServices = async () => {
  const now = Date.now();

  // Si hay datos en cache y no han expirado, devolverlos
  if (servicesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return servicesCache;
  }

  // Si ya hay una petición en curso, esperar a que termine
  if (servicesPromise) {
    return servicesPromise;
  }

  // Crear nueva petición
  servicesPromise = api.get('/services')
    .then(response => {
      servicesCache = response.data;
      cacheTimestamp = now;
      servicesPromise = null; // Limpiar la promesa
      return servicesCache;
    })
    .catch(error => {
      servicesPromise = null; // Limpiar la promesa en caso de error
      throw error.response?.data?.message || 'Error al obtener los servicios.';
    });

  return servicesPromise;
};

// Función para limpiar el cache (útil después de crear/actualizar servicios)
export const clearServicesCache = () => {
  servicesCache = null;
  servicesPromise = null;
  cacheTimestamp = 0;
};