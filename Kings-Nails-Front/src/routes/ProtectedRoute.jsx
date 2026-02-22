import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si aún está cargando la información de autenticación, no renderices nada
  // para evitar un parpadeo a la página de login mientras se verifica el token.
  if (loading) {
    return null; // O un componente de Spinner/Carga
  }

  // Si el usuario está autenticado, renderiza el contenido de la ruta hija (Outlet).
  // Si no, lo redirige a la página de login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;