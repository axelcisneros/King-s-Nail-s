import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RefreshButton.module.css';

const RefreshButton = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      // Dar tiempo para ver la animación
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  return (
    <button
      className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
      onClick={handleClick}
      disabled={isRefreshing}
      aria-label="Actualizar contenido"
      type="button"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    </button>
  );
};

RefreshButton.propTypes = {
  onRefresh: PropTypes.func.isRequired
};

export default RefreshButton;
