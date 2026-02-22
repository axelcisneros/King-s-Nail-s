import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../hooks/useAuth';
import InstallButton from '../InstallButton/InstallButton';
import RefreshButton from '../RefreshButton/RefreshButton';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige a la página de inicio después de cerrar sesión
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <h1 className={styles.logoText}>{'King\u0027s Nail\u0027s'}</h1>
          <Link to="/" className={styles.logo}>
            <img src="/KingsNailsnew.png" alt="Logo de Kings Nails" className={styles.logoImage} />
          </Link>
        </div>
        <div className={styles.actionButtons}>
          <InstallButton />
          <RefreshButton onRefresh={handleRefresh} />
        </div>
        <nav className={styles.nav}>
          <Link to="/servicios" className={styles.navLink}>Servicios</Link>
          <Link to="/galeria" className={styles.navLink}>Galería</Link>
          {user ? (
            <>
              <Link to={user?.role === 'admin' ? '/admin' : '/client'} className={styles.navLink}>{user?.name || 'Usuario'}</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login" className={styles.navLink}>Iniciar Sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;