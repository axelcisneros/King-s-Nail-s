import api from '../config/api';

const getImages = async () => {
  try {
    const response = await api.get('/gallery');
    return response.data;
  } catch (error) {
    // Lanza el error para que el componente que llama pueda manejarlo.
    throw error.response?.data?.message || 'Error al obtener las imágenes de la galería.';
  }
};

export default { getImages };