import PropTypes from 'prop-types';
import styles from './AdminGalleryGrid.module.css';
import headerStyles from '../Header/Header.module.css';

const AdminGalleryGrid = ({ images, onDelete, onPreview }) => {
  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <div key={image._id} className={styles.card}>
          {image.title && <span className={styles.serviceBadge}>{image.title}</span>}
          <img src={image.url || image.imageUrl} alt="Trabajo de uñas" className={styles.image} onClick={() => onPreview && onPreview(image)} />
          {image.user && (
            <div className={styles.userInfo}>
              <small>{image.user.name} {image.user.email ? `(${image.user.email})` : ''}</small>
            </div>
          )}
          {image.createdAt && (
            <div className={styles.dateInfo}>
              <small>{new Date(image.createdAt).toLocaleString()}</small>
            </div>
          )}
          {onDelete && (
            <button onClick={() => onDelete(image._id)} className={`${styles.deleteButton} ${headerStyles.logoutButton}`}>
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

AdminGalleryGrid.propTypes = {
  images: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onPreview: PropTypes.func,
};

export default AdminGalleryGrid;