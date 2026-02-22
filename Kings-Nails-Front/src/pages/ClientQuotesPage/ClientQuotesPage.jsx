import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ClientQuotesPage.module.css';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';
import AppointmentOption from '../../components/AppointmentOption/AppointmentOption';
import ClientDesignsUpload from '../../components/ClientDesignsUpload/ClientDesignsUpload';
import Modal from '../../components/Modal/Modal';
import quoteService from '../../services/quoteService';
import clientDesignService from '../../services/clientDesignService';

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

const ClientQuotesPage = () => {
  const location = useLocation();
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState('');

  const [designs, setDesigns] = useState([]);
  const [designsLoading, setDesignsLoading] = useState(false);
  const [designError, setDesignError] = useState('');
  const [selectedDesignIds, setSelectedDesignIds] = useState([]);
  const [isDesignModalOpen, setDesignModalOpen] = useState(false);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [preferredServiceId, setPreferredServiceId] = useState('');
  const [availableServices, setAvailableServices] = useState([]);

  const validate = (fieldName, value) => {
    if (fieldName === 'service') {
      return value && value.trim() ? '' : 'Selecciona un servicio.';
    }
    return '';
  };

  const {
    formData,
    handleChange,
    validateAll,
    fieldErrors,
    validating,
    touched,
    isValid,
    setFormData,
    reset,
  } = useFormValidation({
    service: '',
    notes: '',
  }, validate);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPreferredServiceId(params.get('servicio') || '');
  }, [location.search]);

  useEffect(() => {
    if (!preferredServiceId || !availableServices.length) return;
    const match = availableServices.find(
      (service) => String(service._id) === preferredServiceId || service.name === preferredServiceId
    );

    if (match && formData.service !== match.name) {
      setFormData((prev) => ({ ...prev, service: match.name }));
    }
  }, [preferredServiceId, availableServices, formData.service, setFormData]);

  const fetchQuotes = useCallback(async () => {
    setQuotesLoading(true);
    setQuotesError('');
    try {
      const data = await quoteService.getMyQuotes();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = typeof err === 'string' ? err : 'No se pudieron cargar tus cotizaciones.';
      setQuotesError(message);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  const fetchDesigns = useCallback(async () => {
    setDesignsLoading(true);
    setDesignError('');
    try {
      const data = await clientDesignService.getMyDesigns();
      setDesigns(Array.isArray(data) ? data : []);
      setSelectedDesignIds((prev) => prev.filter((id) => data.some((design) => design._id === id)));
    } catch (err) {
      const message = typeof err === 'string' ? err : 'No se pudieron cargar tus diseños personales.';
      setDesignError(message);
    } finally {
      setDesignsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    fetchDesigns();
  }, [fetchQuotes, fetchDesigns]);

  const handleServicesLoaded = (services) => {
    const list = Array.isArray(services) ? services : [];
    setAvailableServices(list);

    if (!formData.service && !preferredServiceId && list.length) {
      handleChange({ target: { name: 'service', value: list[0].name } });
    }
  };

  const toggleDesignSelection = (designId) => {
    setSelectedDesignIds((prev) =>
      prev.includes(designId)
        ? prev.filter((id) => id !== designId)
        : [...prev, designId]
    );
  };

  const handleDesignUploadSuccess = () => {
    setDesignError('');
    setDesignModalOpen(false);
    fetchDesigns();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const ok = await validateAll();
    if (!ok) return;

    setSubmitting(true);

    try {
      await quoteService.createQuote({
        service: formData.service,
        notes: formData.notes,
        designIds: selectedDesignIds,
      });
      setFormSuccess('Tu solicitud de cotización ha sido enviada. Recibirás una respuesta del equipo en breve.');
      reset({ service: '', notes: '' });
      setSelectedDesignIds([]);
      // Reestablecer selección automática en el primer servicio disponible
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, service: '' }));
      }, 0);
      fetchQuotes();
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'No se pudo enviar la cotización.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.formSection}>
        <header className={styles.sectionHeader}>
          <div>
            <h2>Solicitar Cotización</h2>
            <p className={styles.sectionSubtitle}>
              Cuéntanos qué servicio necesitas y comparte diseños de referencia si lo deseas. Te enviaremos un precio estimado y comentarios personalizados.
            </p>
          </div>
          <Link to="/client/mis-citas" className={styles.secondaryLink}>
            Ver mis citas
          </Link>
        </header>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {formError && <p className={styles.error}>{formError}</p>}
          {formSuccess && <p className={styles.success}>{formSuccess}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="service">Servicio</label>
            <div className={styles.inputRow}>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <AppointmentOption onLoaded={handleServicesLoaded} />
              </select>
              <ValidationIcon validating={validating.service} error={fieldErrors.service} showOk={touched.service && !fieldErrors.service} />
            </div>
            {fieldErrors.service && <p className={styles.error}>{fieldErrors.service}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="notes">Notas adicionales (opcional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Describe tu idea, colores preferidos, ocasión, etc."
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.designSection}`}>
            <div className={styles.designHeader}>
              <label>Diseños de referencia</label>
              <button
                type="button"
                className={styles.uploadDesignButton}
                onClick={() => setDesignModalOpen(true)}
              >
                Subir nuevo diseño
              </button>
            </div>
            <p className={styles.designHelp}>Selecciona tus diseños existentes para ayudar al equipo a visualizar tu idea.</p>
            {designsLoading && <p className={styles.mutedText}>Cargando tus diseños...</p>}
            {designError && <p className={styles.error}>{designError}</p>}
            {!designsLoading && !designError && designs.length === 0 && (
              <p className={styles.mutedText}>Aún no has subido diseños. Usa el botón de arriba para compartir tu inspiración.</p>
            )}
            {!designsLoading && designs.length > 0 && (
              <div className={styles.designGrid}>
                {designs.map((design) => {
                  const isSelected = selectedDesignIds.includes(design._id);
                  return (
                    <button
                      type="button"
                      key={design._id}
                      className={`${styles.designCard} ${isSelected ? styles.designCardSelected : ''}`}
                      onClick={() => toggleDesignSelection(design._id)}
                      aria-pressed={isSelected}
                    >
                      <img
                        src={design.imageUrl}
                        alt={design.description ? `Diseño personal: ${design.description}` : 'Diseño personal'}
                        className={styles.designImage}
                      />
                      <div className={styles.designOverlay}>
                        {isSelected && <span className={styles.designBadge}>Seleccionado</span>}
                      </div>
                      <div className={styles.designCaption}>
                        {design.description || 'Sin descripción'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <p className={styles.selectionHint}>
              {selectedDesignIds.length
                ? `${selectedDesignIds.length} diseño(s) seleccionado(s).`
                : 'Puedes incluir uno o varios diseños para compartir tu inspiración.'}
            </p>
          </div>

          <button type="submit" className={styles.submitButton} disabled={submitting || !isValid}>
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </section>

      <section className={styles.listSection}>
        <header className={styles.sectionHeader}>
          <div>
            <h2>Mis Cotizaciones</h2>
            <p className={styles.sectionSubtitle}>
              Aquí verás el estado de cada solicitud. Cuando una cotización esté lista, podrás agendar tu cita directamente desde aquí.
            </p>
          </div>
          <Link to="/citas" className={styles.secondaryLink}>
            Agendar cita
          </Link>
        </header>

        {quotesLoading && <p className={styles.mutedText}>Cargando cotizaciones...</p>}
        {quotesError && <p className={styles.error}>{quotesError}</p>}

        {!quotesLoading && !quotesError && quotes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No tienes cotizaciones registradas todavía.</p>
            <p className={styles.mutedText}>Completa el formulario de la izquierda para solicitar la primera.</p>
          </div>
        )}

        {!quotesLoading && !quotesError && quotes.length > 0 && (
          <div className={styles.quoteGrid}>
            {quotes.map((quote) => {
              const statusClass = styles[`status_${quote.status}`] || '';
              const badgeClassName = [styles.statusBadge, statusClass].filter(Boolean).join(' ');
              const price = formatCurrency(quote.adminPrice);
              const createdAt = formatDateTime(quote.createdAt);
              const respondedAt = formatDateTime(quote.respondedAt);
              const canSchedule = quote.status === 'quoted';

              return (
                <article key={quote._id} className={styles.quoteCard}>
                  <header className={styles.quoteCardHeader}>
                    <div>
                      <h3>{quote.service}</h3>
                      {createdAt && <p className={styles.quoteMeta}>Solicitada el {createdAt}</p>}
                      {respondedAt && <p className={styles.quoteMeta}>Respondida el {respondedAt}</p>}
                    </div>
                    <span className={badgeClassName}>{statusLabels[quote.status] || quote.status}</span>
                  </header>

                  <div className={styles.quoteCardBody}>
                    {quote.notes && (
                      <p><strong>Notas enviadas:</strong> {quote.notes}</p>
                    )}
                    {price && (
                      <p><strong>Monto cotizado:</strong> {price}</p>
                    )}
                    {quote.adminComment && (
                      <p><strong>Comentario del equipo:</strong> {quote.adminComment}</p>
                    )}

                    {Array.isArray(quote.designs) && quote.designs.length > 0 && (
                      <div className={styles.designPreviewSection}>
                        <p><strong>Diseños adjuntos:</strong></p>
                        <div className={styles.designPreviewGrid}>
                          {quote.designs.map((design, index) => (
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

                  <footer className={styles.quoteCardFooter}>
                    {canSchedule ? (
                      <Link to={`/citas?quoteId=${quote._id}`} className={styles.primaryAction}>
                        Agendar cita con esta cotización
                      </Link>
                    ) : (
                      <span className={styles.mutedText}>
                        {quote.status === 'requested' && 'Nuestro equipo está revisando tu solicitud.'}
                        {quote.status === 'accepted' && 'Esta cotización ya fue utilizada para agendar una cita.'}
                        {quote.status === 'declined' && 'Esta solicitud fue rechazada. Puedes enviar una nueva cuando quieras.'}
                        {quote.status === 'cancelled' && 'Has cancelado esta cotización.'}
                      </span>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal isOpen={isDesignModalOpen} onClose={() => setDesignModalOpen(false)}>
        <div className={styles.modalContent}>
          <h3>Subir diseño personal</h3>
          <p className={styles.mutedText}>Selecciona una imagen para añadirla a tu colección de diseños.</p>
          <ClientDesignsUpload onUploadSuccess={handleDesignUploadSuccess} />
        </div>
      </Modal>
    </div>
  );
};

export default ClientQuotesPage;
