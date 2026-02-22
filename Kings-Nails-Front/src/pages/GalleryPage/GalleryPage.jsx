import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GalleryPage.module.css';
import galleryService from '../../services/galleryService';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { useAuth } from '../../hooks/useAuth';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isAdmin = !!user && user.role === 'admin';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await galleryService.getImages();
        setImages(data);
      } catch (err) {
        setError('No se pudieron cargar las imágenes. Inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.galleryContainer}>
      <h1 className={styles.title}>Galería de Trabajos
        {!isAdmin && (
          <Link to={user ? '/citas' : '/login?next=/citas'} className={styles.heroButton}>
            Agendar Cita
          </Link>
        )}
      </h1>

      {loading && <p>Cargando diseños...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <div className={styles.grid}>
          {images.map((image) => (
            <GalleryItem key={image._id} image={image} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;