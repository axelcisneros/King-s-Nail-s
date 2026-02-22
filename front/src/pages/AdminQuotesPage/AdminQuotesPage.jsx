import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import AdminQuoteTable from '../../components/AdminQuoteTable/AdminQuoteTable';
import styles from './AdminQuotesPage.module.css';

const STATUS_FILTERS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'requested', label: 'Pendientes' },
  { value: 'quoted', label: 'Cotizadas' },
  { value: 'accepted', label: 'Aceptadas' },
  { value: 'declined', label: 'Rechazadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

const normalizeString = (str) => str?.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';

const AdminQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllQuotes();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'No se pudieron cargar las cotizaciones.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleRespond = async (quoteId, payload) => {
    try {
      setProcessingId(quoteId);
      const sanitizedPayload = { ...payload };
      if (sanitizedPayload.adminPrice !== undefined && sanitizedPayload.adminPrice !== '') {
        const numeric = Number(sanitizedPayload.adminPrice);
        if (Number.isNaN(numeric)) {
          delete sanitizedPayload.adminPrice;
        } else {
          sanitizedPayload.adminPrice = numeric;
        }
      }

      const updatedQuote = await adminService.respondQuote(quoteId, sanitizedPayload);
      setQuotes((prev) =>
        prev.map((quote) => (quote._id === quoteId ? { ...quote, ...updatedQuote } : quote))
      );
      toast.success('Cotización actualizada correctamente.');
    } catch (err) {
      const message = typeof err === 'string'
        ? err
        : err?.response?.data?.message || err?.message || 'Error al actualizar la cotización.';
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = normalizeString(searchTerm);

    return quotes.filter((quote) => {
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      if (!matchesStatus) return false;

      if (!normalizedSearch) return true;

      const haystack = [
        normalizeString(quote.service),
        normalizeString(quote.user?.name),
        normalizeString(quote.user?.email),
      ].join(' ');

      return haystack.includes(normalizedSearch);
    });
  }, [quotes, statusFilter, searchTerm]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Cotizaciones</h1>
          <p className={styles.subtitle}>Revisa, filtra y responde las solicitudes de cotización en tiempo real.</p>
        </div>
        <button type="button" onClick={fetchQuotes} disabled={loading}>
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </header>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="quotes-search">Buscar</label>
          <input
            id="quotes-search"
            type="search"
            placeholder="Buscar por cliente o servicio"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className={styles.controlGroup}>
          <label htmlFor="quotes-filter">Estado</label>
          <select
            id="quotes-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      {loading && !quotes.length ? (
        <p className={styles.loading}>Cargando cotizaciones…</p>
      ) : (
        <AdminQuoteTable
          quotes={filteredQuotes}
          onRespond={handleRespond}
          processingId={processingId}
        />
      )}
    </div>
  );
};

export default AdminQuotesPage;
