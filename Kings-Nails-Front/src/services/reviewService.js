import api from '../config/api';

const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al enviar la reseña.';
  }
};

const getApprovedReviews = async () => {
  try {
    const response = await api.get('/reviews');

    // Backend normally returns an array. Be tolerant: accept array or object with a property containing the list.
    const payload = response.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.reviews)) return payload.reviews;
    if (payload && Array.isArray(payload.data)) return payload.data;
    // Fallback: return empty array
    return [];
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener las reseñas.';
  }
};

const getMyReviews = async () => {
  try {
    const response = await api.get('/reviews/my');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener tus reseñas.';
  }
};

export default { createReview, getApprovedReviews, getMyReviews };