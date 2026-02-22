import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import reviewService from '../../services/reviewService';
import ReviewList from '../../components/ReviewList/ReviewList';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { user } = useAuth();
  // Ocultar el botón de 'Agendar Cita' si el usuario autenticado es admin
  const isAdmin = !!user && user.role === 'admin';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Llamada estándar (tolerante)
        const data = await reviewService.getApprovedReviews();
        // Además, hacer una petición directa para ver la respuesta cruda (diagnóstico)
        // Removed diagnostic raw request
        // If backend returned a non-array or empty array, log payload for debugging
        // no diagnostic logging
        setReviews(data);
      } catch (error) {
        console.error('Error al cargar las reseñas:', error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Estilo y elegancia para tus uñas
            <span className={styles.heroSubtitle}>De sabado a jueves: 9:30 AM - 6:00 PM</span>
          </h2>
          <p className={styles.heroSubtitle}>
            <span className={styles.emojiRow} aria-hidden="true" data-emoji>
              💅 ✨ 🌸 💖
            </span>
            <span className={styles.subtitleText}>Descubre diseños únicos y solicita tu cotización personalizada antes de agendar. La belleza está en tus manos.</span>
          </p>
          <div className={styles.iconStrip} aria-hidden>
            {/* Si tienes imágenes en public/, reemplaza src por '/icons/nail1.png' etc. */}
            <img src="/KingsNails2new.png" alt="logo" className={styles.iconSmall} />
          </div>
          {!isAdmin && (
            <Link
              to={user ? '/client/mis-cotizaciones' : '/login?next=/client/mis-cotizaciones'}
              className={styles.heroButton}
            >
              Solicitar Cotización
            </Link>
          )}
        </div>
      </section>

      {/* Mostrar siempre la sección de reseñas: si no hay reseñas se mostrará una tarjeta informativa */}
      <div className={styles.reviewsSection}>
        <ReviewList reviews={reviews} loading={loadingReviews} />
      </div>
    </div>
  );
};

export default HomePage;