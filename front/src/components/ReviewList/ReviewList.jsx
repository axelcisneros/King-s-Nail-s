import PropTypes from 'prop-types';
import ReviewCard from '../ReviewCard/ReviewCard';
import styles from './ReviewList.module.css';

const ReviewList = ({ reviews, loading = false }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lo que dicen nuestras clientas</h2>
      {loading ? (
        <p className={styles.loading}>Cargando reseñas...</p>
      ) : !reviews || reviews.length === 0 ? (
        <div className={styles.emptyCard}>
          <h3>Aún no hay reseñas</h3>
          <p>¡Sé la primera en dejar una reseña y ayuda a otras clientas a conocer nuestro trabajo!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      rating: PropTypes.number,
      comment: PropTypes.string,
      user: PropTypes.object,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default ReviewList;