import PropTypes from 'prop-types';
import styles from './AdminAppointmentTable.module.css';

const AdminAppointmentTable = ({ appointments, onStatusChange, onReschedule }) => {
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

  const quoteStatusLabels = {
    requested: 'Solicitada',
    quoted: 'Cotizada',
    accepted: 'Aceptada',
    declined: 'Rechazada',
    cancelled: 'Cancelada',
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Cotización</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => {
            // Prefer requestedDate chosen by client; fallback to stored date
            const rawDate = app.requestedDate ?? app.date ?? null;
            const dt = rawDate ? new Date(rawDate) : null;
            const dateText = dt && !isNaN(dt.getTime()) ? dt.toLocaleString('es-ES') : '—';
            const quote = app.quote;
            const quoteStatusLabel = quoteStatusLabels[quote?.status] || (quote?.status
              ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1)
              : 'Sin cotización');
            const quoteStatusClass = quote?.status ? styles[`quote_${quote.status}`] : '';
            const quoteBadgeClassName = [styles.quoteBadge, quoteStatusClass].filter(Boolean).join(' ');
            const formattedQuotePrice = formatCurrency(quote?.adminPrice);

            return (
              <tr key={app._id}>
                <td>{app.clientName}</td>
                <td>{app.clientPhone}</td>
                <td>{app.service}</td>
                <td>{dateText}</td>
                <td>
                  {quote ? (
                    <div className={styles.quoteCell}>
                      <div className={styles.quoteHeader}>
                        <span className={quoteBadgeClassName}>{quoteStatusLabel}</span>
                        {formattedQuotePrice && (
                          <span className={styles.quotePrice}>{formattedQuotePrice}</span>
                        )}
                      </div>
                      {quote.adminComment && (
                        <p className={styles.quoteComment}>{quote.adminComment}</p>
                      )}
                    </div>
                  ) : (
                    <span className={styles.mutedText}>Sin cotización</span>
                  )}
                </td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) => onStatusChange(app._id, e.target.value)}
                    className={`${styles.statusSelect} ${styles[app.status]}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </td>
                <td>
                  {['pending', 'confirmed'].includes(app.status) && (
                    <button
                      onClick={() => onReschedule(app._id)}
                      className={styles.rescheduleButton}
                      title="Reagendar cita"
                    >
                      📅 Reagendar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

AdminAppointmentTable.propTypes = {
  appointments: PropTypes.array.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
};

export default AdminAppointmentTable;