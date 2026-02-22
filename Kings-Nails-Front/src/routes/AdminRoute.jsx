import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // O un spinner de carga
  }

  // Si está autenticado y tiene el rol de 'admin', permite el acceso.
  // De lo contrario, lo redirige a la página de inicio.
  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;