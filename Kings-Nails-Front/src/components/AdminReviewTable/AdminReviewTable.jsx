import PropTypes from 'prop-types';
import styles from './AdminReviewTable.module.css';

const AdminReviewTable = ({ reviews = [], onApprove, onDelete }) => {
  const renderStars = (rating) => {
    return (
      <span className={styles.stars}>
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </span>
    );
  };

  return (
    <div className={styles.tableContainer}>
      {(!reviews || reviews.length === 0) ? (
        <div className={styles.emptyCard}>
          <h3>No hay reseñas aún</h3>
          <p>Aún no se han publicado reseñas. Aquí verás las reseñas cuando los clientes las envíen.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Calificación</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review.user?.name || 'Anónimo'}</td>
                <td>{renderStars(review.rating)}</td>
                <td className={styles.commentCell}>{review.comment}</td>
                <td>
                  {/** El backend usa isApproved (boolean). Convertimos a estado legible */}
                  {(() => {
                    const stateLabel = review.isApproved ? 'approved' : 'pending';
                    return (
                      <span className={`${styles.status} ${styles[stateLabel]}`}>
                        {stateLabel}
                      </span>
                    );
                  })()}
                </td>
                <td className={styles.actionsCell}>
                  {!review.isApproved && (
                    <button onClick={() => onApprove(review._id)} className={styles.approveButton}>
                      Aprobar
                    </button>
                  )}
                  <button onClick={() => onDelete(review._id)} className={styles.deleteButton}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

AdminReviewTable.propTypes = {
  reviews: PropTypes.array.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminReviewTable;