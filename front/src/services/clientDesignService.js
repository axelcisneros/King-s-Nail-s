import api from '../config/api';

const getMyDesigns = async () => {
  try {
    const response = await api.get('/designs');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener tus diseños.';
  }
};

const uploadDesign = async (formData) => {
  try {
    console.log('🔄 Intentando subir diseño...', {
      formData: formData,
      hasFile: formData.has('image'),
      fileDetails: formData.get('image') ? {
        name: formData.get('image').name,
        size: formData.get('image').size,
        type: formData.get('image').type
      } : 'No file'
    });

    // Para subir archivos, es importante setear el header correcto.
    // Axios lo hace automáticamente si le pasas un objeto FormData.
    const response = await api.post('/designs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ Diseño subido exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error detallado al subir diseño:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error.response?.data?.message || 'Error al subir el diseño.';
  }
};

const deleteMyDesign = async (id) => {
  await api.delete(`/designs/${id}`);
};

export default { getMyDesigns, uploadDesign, deleteMyDesign };