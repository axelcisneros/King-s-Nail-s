import { useState, useEffect } from 'react';
import styles from './ClientReviewPage.module.css';
import reviewService from '../../services/reviewService';
import ReviewList from '../../components/ReviewList/ReviewList';

const ClientReviewPage = () => {
  const [myReviews, setMyReviews] = useState([]);

  const fetchMyReviews = async () => {
    try {
      const data = await reviewService.getMyReviews();
      setMyReviews(data);
    } catch {
      // fail silently in UI; toast or UI can show errors if desired
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis Reseñas</h2>
        {myReviews.length === 0 ? (
          <p>Aún no has dejado reseñas.</p>
        ) : (
          <ReviewList reviews={myReviews} />
        )}
      </div>
  );
};

export default ClientReviewPage;