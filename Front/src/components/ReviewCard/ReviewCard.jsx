import PropTypes from 'prop-types';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
  // Función para renderizar las estrellas de la calificación
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= review.rating ? styles.on : styles.off}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  const userName = review?.user?.name || 'Anónimo';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.userName}>{userName}</span>
        <div className={styles.stars}>{renderStars()}</div>
      </div>
      <p className={styles.comment}>&quot;{review.comment || ''}&quot;</p>
    </div>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.shape({
    user: PropTypes.shape({ name: PropTypes.string }),
    rating: PropTypes.number,
    comment: PropTypes.string,
  }).isRequired,
};

export default ReviewCard;