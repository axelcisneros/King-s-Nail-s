import { useState } from 'react';
import PropTypes from 'prop-types';
import reviewService from '../../services/reviewService';
import StarRating from '../StarRating/StarRating';
import styles from './ReviewForm.module.css';
import useFormValidation from '../../hooks/useFormValidation';

const ReviewForm = ({ appointmentId, onReviewSuccess }) => {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (fieldName, value) => {
    if (fieldName === 'comment') {
      if (!value) return '';
      return value.length < 5 ? 'El comentario es demasiado corto.' : '';
    }
    if (fieldName === 'rating') {
      return value > 0 ? '' : 'Por favor, selecciona una calificación.';
    }
    return '';
  };

  const { formData, handleChange, validateAll, setFormData, fieldErrors } = useFormValidation({ comment: '', rating: 0 }, validate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // sync rating state into formData for validation
    setFormData((prev) => ({ ...prev, rating }));
    const ok = await validateAll();
    if (!ok) return;
    setError('');
    setLoading(true);

    try {
        const created = await reviewService.createReview({ appointmentId, rating, comment: formData.comment });
        onReviewSuccess(created); // Notifica al padre que la reseña fue exitosa, pasando la reseña creada
    } catch (err) {
        // err puede ser string o Error; normalizar
        const msg = typeof err === 'string' ? err : err?.message || String(err);
        // Si la API indicó que ya existe una reseña para esta cita, avisar al padre para que marque la cita
        if (msg && msg.includes('Ya existe una reseña')) {
          onReviewSuccess(null, appointmentId);
          return;
        }
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h3 className={styles.title}>Deja tu Reseña</h3>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <label>Calificación</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="comment">Comentario</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows="4"
          placeholder="Cuéntanos sobre tu experiencia..."
          required
          autoComplete="off"
          aria-describedby={fieldErrors.comment ? "comment-error" : "comment-help"}
          aria-invalid={fieldErrors.comment ? "true" : "false"}
          maxLength="500"
        />
        <p id="comment-help" className={styles.hint}>Máximo 500 caracteres</p>
        {fieldErrors.comment && <p id="comment-error" className={styles.error}>{fieldErrors.comment}</p>}
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Reseña'}
      </button>
    </form>
  );
};

ReviewForm.propTypes = {
  appointmentId: PropTypes.string.isRequired,
  onReviewSuccess: PropTypes.func.isRequired,
};

export default ReviewForm;