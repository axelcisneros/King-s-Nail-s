import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './StarRating.module.css';

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={ratingValue <= (hover || rating) ? styles.on : styles.off}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <span className={styles.star}>&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default StarRating;