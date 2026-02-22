import api from '../config/api';

const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al crear la cita.';
  }
};

const getMyAppointments = async () => {
  try {
    const response = await api.get('/appointments/my');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener tus citas.';
  }
};

const cancelMyAppointment = async (id) => {
  try {
    const response = await api.put(`/appointments/my/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al cancelar la cita.';
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

export default { createAppointment, getMyAppointments, cancelMyAppointment, rescheduleAppointment };