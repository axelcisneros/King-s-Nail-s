import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './Carousel.module.css';

// Lista de imágenes para el carrusel. Puedes cambiar estas URLs por las tuyas.
const images = [
  'https://images.unsplash.com/photo-1604654894610-df62318583e2?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522338242285-157941b6191b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633361186252-49a194317a65?q=80&w=2070&auto=format&fit=crop',
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef(null);

  const goToPrevious = useCallback(() => {
    // Usamos la forma funcional de setState para evitar dependencias en el hook
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const startSlideShow = useCallback(() => {
    // Limpia cualquier intervalo existente para evitar duplicados
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      goToNext();
    }, 4000); // Cambia de imagen cada 4 segundos
  }, [goToNext]);

  const stopSlideShow = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  // Efecto para el carrusel automático
  useEffect(() => {
    startSlideShow();
    // Limpia el intervalo cuando el componente se desmonta
    return () => stopSlideShow();
  }, [startSlideShow]);

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={stopSlideShow}
      onMouseLeave={startSlideShow}
    >
      <button onClick={goToPrevious} className={`${styles.arrow} ${styles.leftArrow}`}>
        &#10094;
      </button>
      <div className={styles.slide} style={{ backgroundImage: `url(${images[currentIndex]})` }}></div>
      <button onClick={goToNext} className={`${styles.arrow} ${styles.rightArrow}`}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;