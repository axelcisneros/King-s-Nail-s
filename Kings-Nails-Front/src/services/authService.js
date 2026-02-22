import api from '../config/api';
import { TERMS_VERSION, PRIVACY_VERSION } from '../config/legal';

const register = async (name, email, password) => {
  try {
    // Usar las versiones actuales dinámicamente en vez de valores fijos
    const { data } = await api.post('/users/register', {
      name,
      email,
      password,
      acceptedLegal: true,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
    });
    return data; // { token, user }
  } catch (error) {
    throw error.response?.data?.message || 'Error al registrar el usuario.';
  }
};

const login = async (email, password) => {
  try {
  const { data } = await api.post('/users/login', { email, password });
  // Devuelve { token, user }
  return data;
  } catch (error) {
    throw error.response?.data?.message || 'Email o contraseña incorrectos.';
  }
};

const logout = async () => {
  try {
    // Hacemos una petición al backend para que elimine la cookie de sesión.
    // La responsabilidad de limpiar localStorage es del AuthProvider.
    await api.post('/users/logout');
  } catch (error) {
    console.error('Error durante el logout en el servicio:', error);
    throw error; // Relanzamos el error para que el llamador pueda manejarlo.
  }
};

const checkSession = async () => {
  try {
    // Este endpoint está protegido por la cookie HttpOnly.
    // Si la cookie es válida, devolverá los datos del usuario.
    const { data } = await api.get('/users/profile');
    return data;
  } catch {
    // Es normal que falle si no hay una sesión válida.
    return null;
  }
};

const updateProfile = async (userData) => {
  try {
    // userData puede contener: { name, email, password }
    const { data } = await api.put('/users/profile', userData);
    return data; // Devuelve { user: { ... } }
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar el perfil.';
  }
};

const deleteProfile = async () => {
  try {
    const { data } = await api.delete('/users/profile');
    return data; // Devuelve { message: '...' }
  } catch (error) {
    throw error.response?.data?.message || 'Error al eliminar el perfil.';
  }
};

export default {
  register,
  login,
  logout,
  checkSession,
  updateProfile,
  deleteProfile,
  acceptLegal: async () => {
    try {
      const payload = { termsVersion: TERMS_VERSION, privacyVersion: PRIVACY_VERSION };
      const { data } = await api.post('/users/legal/accept', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'No se pudo registrar la aceptación.';
    }
  },
};