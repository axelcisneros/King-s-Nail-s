import api from '../config/api';

const createQuote = async (payload) => {
  try {
    const { data } = await api.post('/quotes', payload);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al solicitar la cotización.';
  }
};

const getMyQuotes = async () => {
  try {
    const { data } = await api.get('/quotes/my');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener tus cotizaciones.';
  }
};

export default {
  createQuote,
  getMyQuotes,
};
