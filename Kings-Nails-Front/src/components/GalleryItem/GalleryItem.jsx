import PropTypes from 'prop-types';
import styles from './GalleryItem.module.css';

const GalleryItem = ({ image }) => {
  return (
    <div className={styles.card}>
      <img src={image.imageUrl} alt={image.title || 'Diseño de uñas'} className={styles.image} />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{image.title}</h3>
        <p className={styles.description}>{image.description}</p>
      </div>
    </div>
  );
};

GalleryItem.propTypes = {
  image: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default GalleryItem;