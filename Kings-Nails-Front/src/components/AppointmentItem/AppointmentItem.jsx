import PropTypes from 'prop-types';
import styles from './AppointmentItem.module.css';

const AppointmentItem = ({ appointment, onCancel, onReview, onReschedule }) => {
  const formatAppointmentDate = (appt) => {
    // Prefer server 'date' but fallback to requestedDate and common variants
    let raw = appt?.date ?? appt?.requestedDate ?? appt?.requested_date ?? appt?.requestedAt;

    // Handle Mongo-like { $date: '...' } shapes or Date objects
    if (raw && typeof raw === 'object') {
      if ('$date' in raw) raw = raw.$date;
      else if (raw instanceof Date) raw = raw.toISOString();
      else raw = String(raw);
    }

    if (!raw) return 'Fecha no disponible';

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return 'Fecha inválida';

    return d.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formattedDate = formatAppointmentDate(appointment);
  const quote = appointment.quote;

  const quoteStatusLabels = {
    requested: 'Solicitada',
    quoted: 'Cotizada',
    accepted: 'Aceptada',
    declined: 'Rechazada',
    cancelled: 'Cancelada',
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return null;
    }

    try {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 2,
      }).format(Number(value));
  } catch {
      return `$${Number(value).toFixed(2)}`;
    }
  };

  const quoteStatusLabel = quoteStatusLabels[quote?.status] || (quote?.status
    ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1)
    : 'No disponible');

  const quoteStatusClass = quote?.status ? styles[`quote_${quote.status}`] : '';
  const quoteBadgeClassName = [styles.quoteBadge, quoteStatusClass].filter(Boolean).join(' ');
  const formattedQuotePrice = formatCurrency(quote?.adminPrice);

  // El botón de cancelar solo debe aparecer para citas pendientes o confirmadas.
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  // El botón de reagendar solo debe aparecer para:
  // 1. Citas pendientes o confirmadas
  // 2. Citas canceladas POR EL ADMIN (no por el cliente)
  const canReschedule = ['pending', 'confirmed'].includes(appointment.status) ||
    (appointment.status === 'cancelled' && appointment.cancelledBy === 'admin');
  // Prefer explicit `hasReview` provided by the server. Fall back to checking `review` or legacy flags.
  const hasReview = (appointment.hasReview !== undefined && appointment.hasReview !== null)
    ? appointment.hasReview
    : Boolean(appointment.review || appointment.isReviewed);
  const canReview = appointment.status === 'completed' && !hasReview;

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <p><strong>Servicio:</strong> {appointment.service}</p>
        <p><strong>Fecha:</strong> {formattedDate}</p>
        {appointment.notes && <p><strong>Notas:</strong> {appointment.notes}</p>}
        {quote && (
          <div className={styles.quoteSection}>
            <div className={styles.quoteHeader}>
              <p className={styles.quoteTitle}>Cotización</p>
              <span className={quoteBadgeClassName}>{quoteStatusLabel}</span>
            </div>
            <div className={styles.quoteBody}>
              {formattedQuotePrice ? (
                <p><strong>Monto cotizado:</strong> {formattedQuotePrice}</p>
              ) : (
                <p className={styles.mutedText}>El administrador no registró un monto para esta cotización.</p>
              )}
              {quote.adminComment && (
                <p><strong>Mensaje del administrador:</strong> {quote.adminComment}</p>
              )}
              {quote.notes && !appointment.notes && (
                <p><strong>Notas de la cotización:</strong> {quote.notes}</p>
              )}
            </div>
          </div>
        )}
        {Array.isArray(appointment.designs) && appointment.designs.length > 0 && (
          <div className={styles.designPreviewSection}>
            <p><strong>Diseños adjuntos:</strong></p>
            <div className={styles.designPreviewGrid}>
              {appointment.designs.map((design, index) => {
                const designId = typeof design === 'string' ? design : design._id;
                const imageUrl = typeof design === 'string' ? null : design.imageUrl;
                const description = typeof design === 'string' ? '' : design.description;

                if (!imageUrl) {
                  return (
                    <span key={designId || `design-placeholder-${index}`} className={styles.designPlaceholder}>
                      Referencia adjunta
                    </span>
                  );
                }

                return (
                  <a
                    key={designId || `design-item-${index}`}
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.designPreviewItem}
                  >
                    <img
                      src={imageUrl}
                      alt={description ? `Diseño adjunto: ${description}` : 'Diseño adjunto'}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className={styles.statusSection}>
        <span className={`${styles.status} ${styles[appointment.status]}`}>
          {appointment.status}
        </span>
        {canReschedule && (
          <button onClick={() => onReschedule(appointment._id)} className={styles.rescheduleButton}>
            {appointment.status === 'cancelled' && appointment.cancelledBy === 'admin'
              ? 'Reagendar Cita'
              : 'Reagendar'
            }
          </button>
        )}
        {canCancel && (
          <button onClick={() => onCancel(appointment._id)} className={styles.cancelButton}>
            Cancelar
          </button>
        )}
        {canReview && (
          <button onClick={() => onReview(appointment._id)} className={styles.reviewButton}>
            Dejar Reseña
          </button>
        )}
      </div>
    </div>
  );
};

AppointmentItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
};

export default AppointmentItem;