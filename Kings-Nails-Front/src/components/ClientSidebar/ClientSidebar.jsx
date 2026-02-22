import { NavLink } from 'react-router-dom';
import styles from './ClientSidebar.module.css';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ClientSidebar = () => {
  const { user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavClick = () => {
    setIsExpanded(false);
  };

  const isMobile = () => window.innerWidth < 1000;

  // Cerrar sidebar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        className={styles.hamburgerBtn}
        onMouseEnter={() => isMobile() && setIsExpanded(true)}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Abrir menú"
        title="Menu de usuario"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay para cerrar en móvil */}
      <div
        className={`${styles.overlay} ${isExpanded ? styles.show : ''}`}
        onClick={() => setIsExpanded(false)}
      />

      <aside
        className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''}`}
        aria-label="Menu de Usuario"
        onMouseLeave={() => isMobile() && setIsExpanded(false)}
      >
        <div className={styles.header}>
          <h3>Mi Cuenta</h3>
          {user && <p className={styles.username}>{user.name || user.email}</p>}
        </div>
      <nav className={styles.nav}>
        <NavLink to="/client" end className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={handleNavClick}>
          Perfil
        </NavLink>
        <NavLink to="/client/mis-citas" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={handleNavClick}>
          Mis Citas
        </NavLink>
        <NavLink to="/client/mis-cotizaciones" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={handleNavClick}>
          Mis Cotizaciones
        </NavLink>
        <NavLink to="/client/mis-disenos" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={handleNavClick}>
          Mis Diseños
        </NavLink>
        <NavLink to="/client/mis-reseñas" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={handleNavClick}>
          Mis Reseñas
        </NavLink>
      </nav>
      <div className={styles.footer}>
        <NavLink to="/" className={styles.link} onClick={handleNavClick}>Volver</NavLink>
      </div>
    </aside>
    </>
  );
};

export default ClientSidebar;
