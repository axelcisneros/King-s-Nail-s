import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
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
        title="Menu de navegación"
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
        onMouseLeave={() => isMobile() && setIsExpanded(false)}
      >
        <div className={styles.header}>
          <h3>Panel Admin</h3>
        </div>
      <nav className={styles.nav}>
        <NavLink
          to="/admin"
          end // 'end' es importante para que no coincida con otras sub-rutas
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/citas"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Citas
        </NavLink>
        <NavLink
          to="/admin/cotizaciones"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Cotizaciones
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Usuarios
        </NavLink>
        <NavLink
          to="/admin/reseñas"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Reseñas
        </NavLink>
        <NavLink
          to="/admin/galeria"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Galería
        </NavLink>
        <NavLink
          to="/admin/servicios"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={handleNavClick}
        >
          Servicios
        </NavLink>
      </nav>
      <div className={styles.footer}>
        <NavLink to="/" className={styles.link} onClick={handleNavClick}>Volver al Sitio</NavLink>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;