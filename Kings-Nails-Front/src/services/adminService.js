import api from '../config/api';

const getAllAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener todas las citas.';
  }
};

// Añade esta función dentro del archivo
const getUsers = async () => {
  try {
    const { data } = await api.get('/admin/users');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener los usuarios.';
  }
};

const setUserRole = async (id, role) => {
  try {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar el rol del usuario.';
  }
};

const getStats = async () => {
  try {
    const { data } = await api.get('/admin/stats');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener métricas.';
  }
};

const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await api.put(`/appointments/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar la cita.';
  }
};

const rescheduleAppointment = async (id, newDate) => {
  try {
    const response = await api.put(`/appointments/${id}/reschedule`, { newDate });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al reagendar la cita.';
  }
};

const getAllReviews = async () => {
  try {
    const response = await api.get('/reviews/all');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener todas las reseñas.';
  }
};

const getAllQuotes = async () => {
  try {
    const { data } = await api.get('/quotes');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener las cotizaciones.';
  }
};

const respondQuote = async (id, payload) => {
  try {
    const { data } = await api.put(`/quotes/${id}/respond`, payload);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar la cotización.';
  }
};

const approveReview = async (id) => {
  try {
    // El endpoint de backend para aprobar es PUT /api/reviews/:id/approve
    const response = await api.put(`/reviews/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al aprobar la reseña.';
  }
};

const deleteReview = async (id) => {
  try {
    await api.delete(`/reviews/${id}`);
  } catch (error) {
    throw error.response?.data?.message || 'Error al eliminar la reseña.';
  }
};

const getGalleryImages = async () => {
  try {
    const response = await api.get('/gallery');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener las imágenes de la galería.';
  }
};

const getAllUserDesigns = async () => {
  try {
    const response = await api.get('/designs/all');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener los diseños de usuarios.';
  }
};

const addGalleryImage = async (formData) => {
  try {
    console.log('🔄 Intentando subir imagen a galería...', {
      formData: formData,
      hasFile: formData.has('image'),
      hasTitle: formData.has('title'),
      hasDescription: formData.has('description')
    });

    const response = await api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ Imagen de galería subida exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error detallado al subir imagen de galería:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error.response?.data?.message || 'Error al subir la imagen.';
  }
};

const deleteGalleryImage = async (id) => {
  try {
    await api.delete(`/gallery/${id}`);
  } catch (error) {
    throw error.response?.data?.message || 'Error al eliminar la imagen.';
  }
};

const deleteUserDesign = async (id) => {
  try {
    const response = await api.delete(`/designs/all/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al eliminar el diseño del usuario.';
  }
};

const addService = async (serviceData) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al añadir el servicio.';
  }
};

const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar el servicio.';
  }
};

const deleteService = async (id) => {
  try {
    await api.delete(`/services/${id}`);
  } catch (error) {
    throw error.response?.data?.message || 'Error al eliminar el servicio.';
  }
};

export default {
  getUsers,
  setUserRole,
  getAllAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAllReviews,
  approveReview,
  deleteReview,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  getAllUserDesigns,
  deleteUserDesign,
  addService,
  updateService,
  deleteService,
  getStats,
  getAllQuotes,
  respondQuote,
};
