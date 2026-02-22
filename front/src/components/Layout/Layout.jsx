import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';
import { useEffect } from 'react';

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isGallery = pathname.includes('/galeria');

  useEffect(() => {
    // No manipulamos el overflow globalmente aquí; cada página controla su propio scroll.
    return () => {};
  }, [isGallery]);

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.mainContent} data-gradient-surface data-gradient-text>
        <div className={styles.outletWrapper} data-gradient-text>
          <Outlet /> {/* El contenido de la ruta anidada se renderizará aquí */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;