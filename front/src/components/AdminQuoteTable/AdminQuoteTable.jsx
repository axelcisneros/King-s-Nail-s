import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdminQuoteTable.module.css';

const statusLabels = {
  requested: 'En revisión',
  quoted: 'Cotizada',
  accepted: 'Aceptada',
  declined: 'Rechazada',
  cancelled: 'Cancelada',
};

const STATUS_OPTIONS = [
  { value: 'quoted', label: 'Cotizada' },
  { value: 'declined', label: 'Rechazada' },
  { value: 'cancelled', label: 'Cancelada' },
];

const statusToneClass = {
  requested: styles.statusRequested,
  quoted: styles.statusQuoted,
  accepted: styles.statusAccepted,
  declined: styles.statusDeclined,
  cancelled: styles.statusCancelled,
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `$${numeric.toFixed(2)}`;
  }
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getInitialStateForQuote = (quote) => {
  const statusIsKnown =
    STATUS_OPTIONS.some((opt) => opt.value === quote.status) || quote.status === 'accepted';
  const defaultStatus = statusIsKnown ? quote.status : 'quoted';

  return {
    adminPrice: quote.adminPrice ?? '',
    adminComment: quote.adminComment ?? '',
    status: quote.status === 'requested' ? 'quoted' : defaultStatus,
  };
};

const AdminQuoteTable = ({ quotes, onRespond, processingId = null }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialState = quotes.reduce((acc, quote) => {
      acc[quote._id] = getInitialStateForQuote(quote);
      return acc;
    }, {});
    setFormData(initialState);
  }, [quotes]);

  const handleFieldChange = (quoteId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [quoteId]: {
        ...prev[quoteId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (quote) => {
    const current = formData[quote._id] || getInitialStateForQuote(quote);
    const payload = {};

    if (current.adminPrice !== '' && current.adminPrice !== null) {
      payload.adminPrice = current.adminPrice;
    }

    if (current.adminComment !== undefined) {
      payload.adminComment = current.adminComment;
    }

    if (current.status) {
      payload.status = current.status;
    }

    onRespond(quote._id, payload);
  };

  if (!quotes.length) {
    return <p className={styles.emptyState}>No hay cotizaciones registradas todavía.</p>;
  }

  return (
    <div className={styles.grid}>
      {quotes.map((quote) => {
        const current = formData[quote._id] || getInitialStateForQuote(quote);
        const isProcessing = processingId === quote._id;
        const isLocked = quote.status === 'accepted';
        const currentStatusLabel = statusLabels[quote.status] || quote.status;
        const badgeClass = statusToneClass[quote.status] || styles.statusDefault;
        const selectableStatuses =
          quote.status === 'accepted' && !STATUS_OPTIONS.some((option) => option.value === 'accepted')
            ? [{ value: 'accepted', label: 'Aceptada', disabled: true }, ...STATUS_OPTIONS]
            : STATUS_OPTIONS;

        return (
          <article key={quote._id} className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h3>{quote.service}</h3>
                <p className={styles.meta}>Solicitado el {formatDateTime(quote.createdAt)}</p>
                {quote.respondedAt && (
                  <p className={styles.meta}>Actualizado el {formatDateTime(quote.respondedAt)}</p>
                )}
              </div>
              <span className={`${styles.statusBadge} ${badgeClass}`}>{currentStatusLabel}</span>
            </header>

            <section className={styles.body}>
              <div className={styles.infoGroup}>
                <h4>Cliente</h4>
                <ul>
                  <li><strong>Nombre:</strong> {quote.user?.name || '—'}</li>
                  <li><strong>Email:</strong> {quote.user?.email || '—'}</li>
                  <li><strong>Teléfono:</strong> {quote.user?.phone || '—'}</li>
                </ul>
              </div>

              <div className={styles.infoGroup}>
                <h4>Detalle de la solicitud</h4>
                <p><strong>Notas del cliente:</strong> {quote.notes || 'Sin notas adicionales.'}</p>
                <p><strong>Monto cotizado:</strong> {formatCurrency(quote.adminPrice)}</p>
                {quote.adminComment && (
                  <p><strong>Comentario del equipo:</strong> {quote.adminComment}</p>
                )}
              </div>

              {Array.isArray(quote.designs) && quote.designs.length > 0 && (
                <div className={styles.infoGroup}>
                  <h4>Diseños adjuntos</h4>
                  <div className={styles.designGrid}>
                    {quote.designs.map((design) => (
                      <a
                        key={design._id}
                        href={design.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.designItem}
                      >
                        <img src={design.imageUrl} alt={design.description || 'Diseño adjunto'} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <footer className={styles.footer}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`price-${quote._id}`}>Monto a cotizar</label>
                <input
                  id={`price-${quote._id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={current.adminPrice}
                  onChange={(e) => handleFieldChange(quote._id, 'adminPrice', e.target.value)}
                  disabled={isProcessing || isLocked}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`status-${quote._id}`}>Estado</label>
                <select
                  id={`status-${quote._id}`}
                  value={current.status}
                  onChange={(e) => handleFieldChange(quote._id, 'status', e.target.value)}
                  disabled={isProcessing || isLocked}
                >
                  {selectableStatuses.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`comment-${quote._id}`}>Comentario interno</label>
                <textarea
                  id={`comment-${quote._id}`}
                  rows={3}
                  value={current.adminComment}
                  onChange={(e) => handleFieldChange(quote._id, 'adminComment', e.target.value)}
                  disabled={isProcessing || isLocked}
                  placeholder="Notas para el cliente"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSubmit(quote)}
                disabled={isProcessing || isLocked}
              >
                {isLocked ? 'Cotización aceptada' : isProcessing ? 'Guardando...' : 'Guardar respuesta'}
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  );
};

AdminQuoteTable.propTypes = {
  quotes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    notes: PropTypes.string,
    adminPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    adminComment: PropTypes.string,
    designs: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      imageUrl: PropTypes.string,
      description: PropTypes.string,
    })),
    createdAt: PropTypes.string,
    respondedAt: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
  })).isRequired,
  onRespond: PropTypes.func.isRequired,
  processingId: PropTypes.string,
};

export default AdminQuoteTable;
