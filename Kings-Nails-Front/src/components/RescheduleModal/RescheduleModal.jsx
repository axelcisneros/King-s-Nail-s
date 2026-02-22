import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RescheduleModal.module.css';

const RescheduleModal = ({ isOpen, onClose, onConfirm, appointment = {}, isLoading = false }) => {
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Validar que appointment exista y tenga fecha
  const appointmentDate = appointment?.date || appointment?.requestedDate;
  if (!appointment || !appointmentDate) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Error</h2>
            <button onClick={onClose} className={styles.closeButton}>×</button>
          </div>
          <div className={styles.modalBody}>
            <p>No se puede reagendar: información de cita inválida.</p>
          </div>
        </div>
      </div>
    );
  }

  // Validar y crear fecha original
  const originalDate = new Date(appointmentDate);
  if (isNaN(originalDate.getTime())) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Error</h2>
            <button onClick={onClose} className={styles.closeButton}>×</button>
          </div>
          <div className={styles.modalBody}>
            <p>No se puede reagendar: fecha de cita inválida.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calcular días restantes hasta la cita
  const currentDate = new Date();
  const timeDiff = originalDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Validar que se puede reagendar (mínimo 3 días)
  if (daysRemaining < 3) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>No se puede reagendar</h2>
            <button onClick={onClose} className={styles.closeButton}>×</button>
          </div>
          <div className={styles.modalBody}>
            <p>No se puede reagendar cuando faltan menos de 3 días para la cita.</p>
            <p><strong>Fecha de tu cita:</strong> {formatDate(appointmentDate)}</p>
            <p><strong>Días restantes:</strong> {daysRemaining} día(s)</p>
          </div>
        </div>
      </div>
    );
  }

  // Determinar rango de fechas según días restantes
  let minDate, maxDate, restrictionText;

  if (daysRemaining >= 3 && daysRemaining <= 10) {
    // 3-10 días: Solo futuras (sin adelantar)
    minDate = new Date().toISOString().split('T')[0];
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    maxDate = oneYearFromNow.toISOString().split('T')[0];
    restrictionText = "Solo se puede reagendar a fechas futuras (sin adelantar)";

  } else if (daysRemaining >= 11 && daysRemaining <= 15) {
    // 11-15 días: Adelantar hasta 7 días antes + futuras
    const sevenDaysBefore = new Date(originalDate);
    sevenDaysBefore.setDate(originalDate.getDate() - 7);
    minDate = sevenDaysBefore.toISOString().split('T')[0];
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    maxDate = oneYearFromNow.toISOString().split('T')[0];
    restrictionText = "Se puede adelantar hasta 7 días antes de la fecha original";

  } else if (daysRemaining >= 16 && daysRemaining <= 30) {
    // 16-30 días: Adelantar hasta 15 días antes + futuras
    const fifteenDaysBefore = new Date(originalDate);
    fifteenDaysBefore.setDate(originalDate.getDate() - 15);
    minDate = fifteenDaysBefore.toISOString().split('T')[0];
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    maxDate = oneYearFromNow.toISOString().split('T')[0];
    restrictionText = "Se puede adelantar hasta 15 días antes de la fecha original";

  } else {
    // Más de 30 días: Adelantar hasta 1 mes antes + futuras
    const oneMonthBefore = new Date(originalDate);
    oneMonthBefore.setMonth(originalDate.getMonth() - 1);
    minDate = oneMonthBefore.toISOString().split('T')[0];
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    maxDate = oneYearFromNow.toISOString().split('T')[0];
    restrictionText = "Se puede adelantar hasta 1 mes antes de la fecha original";
  }  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newDate) {
      setError('Por favor selecciona una nueva fecha.');
      return;
    }

    const selectedDate = new Date(newDate);
    const minDateObj = new Date(minDate);

    // Validación dinámica según el rango permitido
    if (selectedDate < minDateObj) {
      if (daysRemaining >= 3 && daysRemaining <= 10) {
        setError('Solo se puede reagendar a fechas futuras (no se puede adelantar).');
      } else if (daysRemaining >= 11 && daysRemaining <= 15) {
        setError('No se puede adelantar más de 7 días antes de la fecha original.');
      } else if (daysRemaining >= 16 && daysRemaining <= 30) {
        setError('No se puede adelantar más de 15 días antes de la fecha original.');
      } else {
        setError('No se puede adelantar más de 1 mes antes de la fecha original.');
      }
      return;
    }

    onConfirm(appointment._id, newDate);
  };

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';

    return dateObj.toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {appointment.status === 'cancelled' && appointment.cancelledBy === 'admin'
              ? 'Reagendar Cita Cancelada'
              : 'Reagendar Cita'
            }
          </h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalBody}>
          {appointment.status === 'cancelled' && appointment.cancelledBy === 'admin' && (
            <div className={styles.cancelledNotice}>
              <h3>⚠️ Cita Cancelada por Administrador</h3>
              <p>Esta cita fue cancelada por el administrador. Al reagendar, se creará una nueva solicitud de cita que deberá ser confirmada nuevamente.</p>
            </div>
          )}

          <div className={styles.currentInfo}>
            <h3>Información de la cita:</h3>
            <p><strong>Servicio:</strong> {appointment.service}</p>
            <p><strong>Fecha original:</strong> {formatDate(appointmentDate)}</p>
            <p><strong>Días restantes:</strong> {daysRemaining} día(s)</p>
            {appointment.status === 'cancelled' && appointment.cancelledBy === 'admin' && (
              <p><strong>Estado:</strong> <span className={styles.cancelledStatus}>Cancelada por administrador</span></p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="newDate">Nueva fecha y hora:</label>
              <input
                type="datetime-local"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={minDate}
                max={maxDate}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.restrictions}>
              <h4>📋 Restricciones para reagendar:</h4>
              <p className={styles.restrictionText}>{restrictionText}</p>
              {appointment.status === 'cancelled' && appointment.cancelledBy === 'admin' && (
                <div className={styles.additionalInfo}>
                  <p>⚠️ La cita reagendada quedará pendiente de confirmación</p>
                </div>
              )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelBtn}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.confirmBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Reagendando...' :
                 appointment.status === 'cancelled' && appointment.cancelledBy === 'admin'
                   ? 'Reactivar y Reagendar'
                   : 'Confirmar Reagendación'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

RescheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  appointment: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default RescheduleModal;