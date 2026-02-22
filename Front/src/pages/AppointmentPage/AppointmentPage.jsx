import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';
import quoteService from '../../services/quoteService';
import { useAuth } from '../../hooks/useAuth';
import styles from './AppointmentPage.module.css';
import { isValidPhone, isFutureDate } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';

const statusLabels = {
  requested: 'En revisión',
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

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function AppointmentPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialQuoteId = searchParams.get('quoteId') || '';

  const validate = useCallback((fieldName, value) => {
    if (fieldName === 'clientPhone') {
      return isValidPhone(value) ? '' : 'Por favor ingresa un teléfono de contacto válido.';
    }
    if (fieldName === 'date') {
      return isFutureDate(value) ? '' : 'Por favor selecciona una fecha y hora en el futuro.';
    }
    if (fieldName === 'quoteId') {
      if (quotesLoading) return '';
      if (!value) return 'Selecciona una cotización disponible.';
      const allowed = quotes.some((quote) => quote._id === value && quote.status === 'quoted');
      return allowed ? '' : 'La cotización seleccionada ya no está disponible.';
    }
    return '';
  }, [quotes, quotesLoading]);

  const {
    formData,
    handleChange,
    validateAll,
    fieldErrors,
    validating,
    touched,
    setFormData,
    reset,
  } = useFormValidation({
    quoteId: initialQuoteId,
    clientPhone: '',
    date: '',
  }, validate);

  const fetchQuotes = useCallback(async () => {
    setQuotesLoading(true);
    setQuotesError('');
    try {
      const data = await quoteService.getMyQuotes();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = typeof err === 'string' ? err : 'No se pudieron cargar tus cotizaciones disponibles.';
      setQuotesError(message);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      const next = encodeURIComponent(location.pathname + location.search || '/citas');
      navigate(`/login?next=${next}`);
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (user) {
      fetchQuotes();
    } else {
      setQuotes([]);
    }
  }, [user, fetchQuotes]);

  useEffect(() => {
    if (!user) return;
    if (!user.phone) return;
    setFormData((prev) => ({ ...prev, clientPhone: user.phone }));
  }, [user, setFormData]);

  const schedulableQuotes = useMemo(
    () => quotes.filter((quote) => quote.status === 'quoted'),
    [quotes]
  );

  useEffect(() => {
    if (quotesLoading) return;

    if (!schedulableQuotes.length) {
      if (formData.quoteId) {
        setFormData((prev) => ({ ...prev, quoteId: '' }));
      }
      return;
    }

    let desiredId = formData.quoteId;

    if (initialQuoteId && schedulableQuotes.some((quote) => quote._id === initialQuoteId)) {
      desiredId = initialQuoteId;
    } else if (!schedulableQuotes.some((quote) => quote._id === formData.quoteId)) {
      desiredId = schedulableQuotes[0]._id;
    }

    if (desiredId !== formData.quoteId) {
      setFormData((prev) => ({ ...prev, quoteId: desiredId }));
    }
  }, [schedulableQuotes, formData.quoteId, setFormData, quotesLoading, initialQuoteId]);

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote._id === formData.quoteId) || null,
    [quotes, formData.quoteId]
  );

  const buildQuoteLabel = (quote) => {
    const responded = formatDateTime(quote.respondedAt) || formatDateTime(quote.createdAt);
    const price = formatCurrency(quote.adminPrice);
    const pieces = [quote.service];
    if (price) pieces.push(price);
    if (responded) pieces.push(responded);
    return pieces.join(' · ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const ok = await validateAll();
    if (!ok) return;

    setLoading(true);

    try {
      await appointmentService.createAppointment({
        clientPhone: formData.clientPhone,
        requestedDate: formData.date,
        quoteId: formData.quoteId,
      });

      setSuccess('¡Tu cita ha sido solicitada con éxito! Pronto nos pondremos en contacto para confirmarla.');
      await fetchQuotes();
      reset({ quoteId: '', clientPhone: formData.clientPhone, date: '' });

      setTimeout(() => {
        navigate('/client/mis-citas');
      }, 3500);
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'No se pudo crear la cita.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = Boolean(formData.quoteId) && !quotesLoading && !loading;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <h2 className={styles.title}>Agendar una Cita</h2>
        <p className={styles.subtitle}>
          Selecciona la cotización aprobada por el equipo y elige la fecha que te convenga. Los detalles del servicio se tomarán automáticamente de la cotización.
        </p>

        {quotesLoading && <p className={styles.info}>Cargando tus cotizaciones disponibles...</p>}
        {quotesError && <p className={styles.error}>{quotesError}</p>}
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        {!quotesLoading && !quotesError && schedulableQuotes.length === 0 && (
          <div className={styles.emptyState}>
            <p>Necesitas una cotización aprobada antes de agendar tu cita.</p>
            <Link to="/client/mis-cotizaciones" className={styles.linkButton}>
              Solicitar una cotización
            </Link>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="quoteId">Cotización</label>
          <div className={styles.inputRow}>
            <select
              id="quoteId"
              name="quoteId"
              value={formData.quoteId}
              onChange={handleChange}
              disabled={quotesLoading || schedulableQuotes.length === 0}
              required
            >
              <option value="" disabled hidden>
                Selecciona una cotización lista para agendar
              </option>
              {schedulableQuotes.map((quote) => (
                <option key={quote._id} value={quote._id}>
                  {buildQuoteLabel(quote)}
                </option>
              ))}
            </select>
            <ValidationIcon validating={validating.quoteId} error={fieldErrors.quoteId} showOk={touched.quoteId && !fieldErrors.quoteId} />
          </div>
          {fieldErrors.quoteId && <p className={styles.error}>{fieldErrors.quoteId}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="clientPhone">Teléfono de contacto</label>
          <div className={styles.inputRow}>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              placeholder="Ej: 5512345678"
              required
            />
            <ValidationIcon validating={validating.clientPhone} error={fieldErrors.clientPhone} showOk={touched.clientPhone && !fieldErrors.clientPhone} />
          </div>
          {fieldErrors.clientPhone && <p className={styles.error}>{fieldErrors.clientPhone}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="date">Fecha y hora preferidas</label>
          <div className={styles.inputRow}>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <ValidationIcon validating={validating.date} error={fieldErrors.date} showOk={touched.date && !fieldErrors.date} />
          </div>
          {fieldErrors.date && <p className={styles.error}>{fieldErrors.date}</p>}
        </div>

        {selectedQuote && (
          <section className={styles.quoteDetails} aria-live="polite">
            <header className={styles.quoteHeader}>
              <div>
                <h3>{selectedQuote.service}</h3>
                {selectedQuote.respondedAt && (
                  <p className={styles.quoteMeta}>Cotizada el {formatDateTime(selectedQuote.respondedAt)}</p>
                )}
              </div>
              <span className={`${styles.quoteBadge} ${styles[`status_${selectedQuote.status}`] || ''}`}>
                {statusLabels[selectedQuote.status] || selectedQuote.status}
              </span>
            </header>

            <div className={styles.quoteBody}>
              {selectedQuote.adminPrice !== undefined && selectedQuote.adminPrice !== null && (
                <p><strong>Monto cotizado:</strong> {formatCurrency(selectedQuote.adminPrice)}</p>
              )}
              {selectedQuote.adminComment && (
                <p><strong>Comentario del equipo:</strong> {selectedQuote.adminComment}</p>
              )}
              {selectedQuote.notes && (
                <p><strong>Notas que enviaste:</strong> {selectedQuote.notes}</p>
              )}
              <p className={styles.quoteHint}>El servicio y los diseños adjuntos se guardarán automáticamente en tu cita.</p>

              {Array.isArray(selectedQuote.designs) && selectedQuote.designs.length > 0 && (
                <div className={styles.designPreviewSection}>
                  <p><strong>Diseños adjuntos:</strong></p>
                  <div className={styles.designPreviewGrid}>
                    {selectedQuote.designs.map((design, index) => (
                      <a
                        key={design._id || `design-${index}`}
                        href={design.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.designPreviewItem}
                      >
                        <img
                          src={design.imageUrl}
                          alt={design.description ? `Diseño adjunto: ${design.description}` : 'Diseño adjunto'}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
          {loading ? 'Enviando...' : 'Confirmar solicitud de cita'}
        </button>
      </form>
    </div>
  );
}

export default AppointmentPage;