import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginSuccessPage.module.css';

const LoginSuccessPage = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Este efecto se ejecutará cada vez que 'loading' cambie.
    // Cuando 'loading' sea false, significa que la verificación de sesión ha terminado.
    if (!loading) {
      if (isAuthenticated) {
        // Redirigir según rol
        if (user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/client', { replace: true });
        }
      } else {
        // Si por alguna razón no está autenticado, lo enviamos a la página de login.
        navigate('/login', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user?.role, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verificando sesión...</h1>
      <p className={styles.message}>Un momento por favor, estamos preparando todo para ti.</p>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoginSuccessPage;