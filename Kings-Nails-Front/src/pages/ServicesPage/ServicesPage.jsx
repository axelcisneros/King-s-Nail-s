import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './ServicesPage.module.css';
import { getServices } from '../../services/serviceService';

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—';
  }

  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? '—' : `$${numeric.toFixed(2)}`;
  }
};

const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined || Number.isNaN(Number(minutes))) {
    return 'Consulta';
  }
  const mins = Number(minutes);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  if (remainder === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  return `${hours} ${hours === 1 ? 'hora' : 'horas'} ${remainder} min`;
};

const ServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getServices();
        if (!isMounted) return;
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        const message = typeof err === 'string' ? err : 'No se pudieron cargar los servicios. Inténtalo más tarde.';
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedServices = useMemo(() => (
    [...services].sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      return priceA - priceB;
    })
  ), [services]);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Servicios y Tarifas</h1>
          <p>
            Explora nuestra lista de servicios profesionales en cuidado de uñas. Cada tratamiento está diseñado para resaltar tu estilo
            y ofrecerte una experiencia relajante. Solicita tu cotización personalizada para reservar según tu preferencia.
          </p>
          {user?.role === 'client' && (
            <Link to="/client/mis-cotizaciones" className={styles.cta}>Solicitar cotización</Link>
          )}
        </div>
      </section>
      <section className={styles.termsSection}>
        <h3>Precios sujetos a cotización</h3>
        <p>
          Los importes mostrados corresponden a los precios base definidos por el equipo de Kings Nails según cada servicio estándar.
          El costo final puede variar dependiendo del diseño personalizado, materiales especiales o solicitudes adicionales.
        </p>
        <p className={styles.termsNote}>
          Al solicitar tu cotización te orientaremos sobre el presupuesto definitivo antes de agendar cualquier cita.
        </p>
      </section>

      <section className={styles.listSection}>
        <header className={styles.listHeader}>
          <h2>Nuestro catálogo</h2>
          <p className={styles.listSubtitle}>
            Estos servicios son establecidos por nuestro equipo administrativo para garantizar transparencia en los costos base.
          </p>
        </header>

        {loading && <p className={styles.info}>Cargando servicios...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && sortedServices.length === 0 && (
          <div className={styles.emptyState}>
            <p>Aún no hay servicios publicados. Regresa pronto para descubrir nuestras opciones.</p>
          </div>
        )}

        {!loading && !error && sortedServices.length > 0 && (
          <div className={styles.grid}>
            {sortedServices.map((service) => (
              <article key={service._id} className={styles.card}>
                <header className={styles.cardHeader}>
                  <h3>{service.name}</h3>
                  <div className={styles.priceTag}>
                    <span className={styles.priceLabel}>Precio base</span>
                    <span className={styles.priceValue}>{formatCurrency(service.price)}</span>
                  </div>
                </header>
                {service.description && <p className={styles.description}>{service.description}</p>}
                <footer className={styles.cardFooter}>
                  <span className={styles.durationLabel}>
                    Duración estimada: {formatDuration(service.duration)}
                  </span>
                  {user?.role === 'client' ? (
                    <Link to={`/client/mis-cotizaciones?servicio=${encodeURIComponent(service._id)}`} className={styles.cardCta}>
                      Cotizar este servicio
                    </Link>
                  ) : (
                    <span className={styles.cardCtaDisabled}>Inicia sesión como cliente para cotizar</span>
                  )}
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default ServicesPage;
