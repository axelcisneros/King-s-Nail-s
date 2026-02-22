import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import styles from './AdminDashboardPage.module.css';
import adminService from '../../services/adminService';
import DonutChart from '../../components/Charts/DonutChart';
// ResponsiveLine removed; not needed currently
// ...existing code...
const defaultQuoteTotals = { requested: 0, cancelled: 0, accepted: 0 };
const StatCard = ({ title, value }) => (
  <div className={styles.card}>
    <div className={styles.cardTitle}>{title}</div>
    <div className={styles.cardValue}>{value}</div>
  </div>
);
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const QuoteStatusCard = ({ totals = defaultQuoteTotals }) => {
  const safeTotals = totals ?? defaultQuoteTotals;
  const items = [
    { key: 'requested', label: 'Solicitadas', className: styles.quoteRequested },
    { key: 'cancelled', label: 'Canceladas', className: styles.quoteCancelled },
    { key: 'accepted', label: 'Aceptadas', className: styles.quoteAccepted },
  ];

  return (
    <div className={`${styles.card} ${styles.quoteCard}`}>
      <div className={styles.cardTitle}>Cotizaciones por estado</div>
      <ul className={styles.quoteList}>
        {items.map(({ key, label, className }) => (
          <li key={key} className={styles.quoteRow}>
            <span className={`${styles.quoteChip} ${className}`}>{label}</span>
            <span className={styles.quoteValue}>{Number(safeTotals[key] || 0)}</span>
          </li>
        ))}
      </ul>
      <p className={styles.quoteHint}>Métricas reportadas desde las solicitudes realizadas por los clientes.</p>
    </div>
  );
};

QuoteStatusCard.propTypes = {
  totals: PropTypes.shape({
    requested: PropTypes.number,
    cancelled: PropTypes.number,
    accepted: PropTypes.number,
  }),
};

const appointmentStatusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  requested: 'Solicitada',
  quoted: 'Cotizada',
  accepted: 'Aceptada',
  declined: 'Rechazada',
  rescheduled: 'Reprogramada',
  no_show: 'No asistió',
  unknown: 'Sin estado',
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  // chartError eliminado porque no se usa
  const [slide, setSlide] = useState(0);
  const [ySlide, setYSlide] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        setError(err.toString());
      }
    };
    load();

  // Sin capturador global innecesario
  }, []);

  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!stats) return <div className={styles.container}>Cargando métricas...</div>;

  // Usaremos las agregaciones mensuales devueltas por el backend

  // Usar las agregaciones mensuales devueltas por el backend
  const appointmentsByMonthRaw = stats.appointmentsByMonth || [];
  const reviewsByMonthRaw = stats.reviewsByMonth || [];
  const reviewsByMonthRatings = stats.reviewsByMonthRatings || [];
  const appointmentsByMonthThisYear = stats.appointmentsByMonthThisYear || [];
  const reviewsByMonthThisYear = stats.reviewsByMonthThisYear || [];
  const quoteStatusTotals = stats.quoteStatusTotals || { requested: 0, cancelled: 0, accepted: 0 };
  const quotesByMonthRaw = stats.quotesByMonth || [];
  const quotesByMonthThisYear = stats.quotesByMonthThisYear || [];

  // reviewsByDayThisMonth and reviewsByRating are available from the API if needed

  return (
    <div className={styles.container}>
      <h1>Panel de Administración</h1>
      <div className={styles.grid}>
        <QuoteStatusCard totals={quoteStatusTotals} />
        <StatCard title="Reseñas totales" value={stats.totalReviews} />
        <StatCard title="Puntuación promedio" value={stats.avgRating} />
        <StatCard title="Imágenes en galería" value={stats.totalImages} />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.pieChart}>
          {/* Slider de métricas por mes, agrupación por mes */}
          {(() => {
            const monthLabel = (yr, m) => new Date(yr, m - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' });

            // Construir citasPorMes usando appointmentsByMonthRaw
            const citasPorMes = {};
            appointmentsByMonthRaw.forEach((item) => {
              const { _id, count } = item;
              if (!_id) return;
              const label = monthLabel(_id.year, _id.month);
              const status = _id.status || 'unknown';
              if (!citasPorMes[label]) citasPorMes[label] = {};
              citasPorMes[label][status] = (citasPorMes[label][status] || 0) + Number(count || 0);
            });

            const cotizacionesPorMes = {};
            const quoteStatusMeta = {
              requested: { label: 'Solicitadas', color: '#f59e0b' },
              cancelled: { label: 'Canceladas', color: '#ef4444' },
              accepted: { label: 'Aceptadas', color: '#10b981' },
            };

            quotesByMonthRaw.forEach((item) => {
              const { _id, count } = item;
              if (!_id) return;
              const label = monthLabel(_id.year, _id.month);
              if (!cotizacionesPorMes[label]) cotizacionesPorMes[label] = {};
              cotizacionesPorMes[label][_id.status] = (cotizacionesPorMes[label][_id.status] || 0) + Number(count || 0);
            });

            const reviewsPorMes = {};
            reviewsByMonthRaw.forEach((item) => {
              const { _id, count, avgRating } = item;
              if (!_id) return;
              const label = monthLabel(_id.year, _id.month);
              reviewsPorMes[label] = { total: count, avg: Number((avgRating || 0).toFixed(2)) };
            });

            const slideData = [];

            // Slide: citas por estado por mes
            if (Object.keys(citasPorMes).length === 0) {
              slideData.push({ title: 'Citas por estado (por mes)', content: <div style={{ textAlign: 'center', padding: 10 }}>No hay citas registradas.</div> });
            } else {
              slideData.push({
                title: 'Citas por estado (por mes)',
                content: Object.entries(citasPorMes).map(([mes, estados]) => {
                  const statusItems = Object.entries(estados || {}).map(([status, value]) => ({
                    id: status,
                    label: appointmentStatusLabels[status] || status,
                    value: Number(value || 0),
                  }));

                  const hasData = statusItems.some((item) => item.value > 0);

                  return (
                    <div key={mes} style={{ marginBottom: 16 }}>
                      <h4 style={{ textAlign: 'center' }}>{mes}</h4>
                      <div className={styles.monthlyBreakdown}>
                        <div className={styles.monthlyChart}>
                          {hasData ? (
                            <DonutChart data={statusItems} size={220} innerRadius={0.55} />
                          ) : (
                            <div className={styles.noData}>Sin datos de citas</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }),
              });
            }

            // Slide: cotizaciones por mes (gráfica de dona)
            if (Object.keys(cotizacionesPorMes).length === 0) {
              slideData.push({ title: 'Cotizaciones por estado (por mes)', content: <div style={{ textAlign: 'center', padding: 10 }}>No hay cotizaciones registradas.</div> });
            } else {
              slideData.push({
                title: 'Cotizaciones por estado (por mes)',
                content: Object.entries(cotizacionesPorMes).map(([mes, estados]) => {
                  const data = Object.entries(estados)
                    .filter(([status, value]) => ['requested', 'cancelled', 'accepted'].includes(status) && Number(value) > 0)
                    .map(([status, value]) => ({
                      id: status,
                      label: quoteStatusMeta[status]?.label || status,
                      value: Number(value || 0),
                      color: quoteStatusMeta[status]?.color,
                    }));

                  const colors = data.map(item => item.color).filter(Boolean);

                  return (
                    <div key={mes} style={{ marginBottom: 16 }}>
                      <h4 style={{ textAlign: 'center' }}>{mes}</h4>
                      {data.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#6b7280' }}>Sin datos de cotizaciones</div>
                      ) : (
                        <div style={{ width: 180, height: 180, margin: '0 auto'}}>
                          <DonutChart data={data} size={200} innerRadius={0.55} colors={colors} />
                        </div>
                      )}
                    </div>
                  );
                }),
              });
            }

            // Slide: reseñas por mes (Nivo: barras para cantidad y línea para promedio)
            if (Object.keys(reviewsPorMes).length === 0) {
              slideData.push({ title: 'Reseñas (estrellas y por mes)', content: <div style={{ textAlign: 'center', padding: 10 }}>No hay reseñas registradas.</div> });
            } else {
              // For reviews per month: render a Donut per month with segments per star (1..5)
              const monthsR = Object.keys(reviewsPorMes);
              slideData.push({
                title: 'Reseñas (por mes, por estrellas)',
                content: monthsR.map(m => {
                  // build pie data from reviewsByMonthRatings filtered by month label
                  const yearMonth = (() => {
                    // find one raw item to extract year/month
                    const raw = reviewsByMonthRaw.find(r => {
                      const label = monthLabel(r._id.year, r._id.month);
                      return label === m;
                    });
                    return raw?._id || null;
                  })();

                  const monthRatings = reviewsByMonthRatings.filter(r => {
                    if (!yearMonth) return false;
                    return r._id.year === yearMonth.year && r._id.month === yearMonth.month;
                  });

                  const pieData = [1,2,3,4,5].map(st => {
                    const found = monthRatings.find(x => x._id.rating === st);
                    return { id: String(st), label: `${st}★`, value: found?.count || 0 };
                  }).filter(d => d.value > 0);

                  return (
                    <div key={m} style={{ marginBottom: 16, textAlign: 'center' }}>
                      <h4>{m}</h4>
                      {pieData.length === 0 ? (
                        <div>No hay reseñas para este mes</div>
                      ) : (
                        <div style={{ width: 180, height: 180, margin: '0 auto' }}>
                          <DonutChart data={pieData} size={180} innerRadius={0.6} />
                        </div>
                      )}
                    </div>
                  );
                }),
              });
            }

            // Asegurar índice de slide válido
            const idx = Math.max(0, Math.min(slide, slideData.length - 1));
            if (idx !== slide) setSlide(idx);

            return (
              <div className={styles.sliderContainer}>
                <h3 style={{ textAlign: 'center' }}>{slideData[idx]?.title || 'Métricas'}</h3>
                <div>{slideData[idx]?.content}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={() => setSlide((idx - 1 + slideData.length) % slideData.length)} style={{ fontSize: 18, padding: '4px 12px' }}>◀</button>
                  <span style={{ fontWeight: 'bold' }}>{idx + 1} / {slideData.length}</span>
                  <button onClick={() => setSlide((idx + 1) % slideData.length)} style={{ fontSize: 18, padding: '4px 12px' }}>▶</button>
                </div>
              </div>
            );
          })()}
        </div>

        <div className={styles.yearlyCharts}>
            {(() => {
              // Force full 12 months on X axis for the yearly charts
              const currentYear = new Date().getFullYear();
              const months = Array.from({ length: 12 }, (_, i) => i + 1);
              const monthLabels = months.map(m => new Date(currentYear, m - 1, 1).toLocaleString('default', { month: 'short' }));

              let quotesData = months.map((m, i) => ({ month: monthLabels[i], cotizaciones: (quotesByMonthThisYear.find(x => x._id?.month === m)?.count) || 0 }));
              let appointmentsData = months.map((m, i) => ({ month: monthLabels[i], citas: (appointmentsByMonthThisYear.find(x => x._id?.month === m)?.count) || 0 }));
              let reviewsData = months.map((m, i) => ({ month: monthLabels[i], reseñas: (reviewsByMonthThisYear.find(x => x._id?.month === m)?.count) || 0 }));


              const monthColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#0ea5e9', '#22d3ee', '#3b82f6', '#a855f7', '#f472b6'];

              const slides = [
                {
                  title: `Cotizaciones ${currentYear}`,
                  data: quotesData,
                  key: 'cotizaciones',
                  emptyMessage: 'Sin cotizaciones registradas en el año.',
                },
                {
                  title: `Citas ${currentYear}`,
                  data: appointmentsData,
                  key: 'citas',
                  emptyMessage: 'Sin citas registradas en el año.',
                },
                {
                  title: `Reseñas ${currentYear}`,
                  data: reviewsData,
                  key: 'reseñas',
                  emptyMessage: 'Sin reseñas registradas en el año.',
                },
              ];

              const yIdxLocal = Math.max(0, Math.min(ySlide, slides.length - 1));
              const selected = slides[yIdxLocal];
              const chartData = selected.data.map((item, index) => ({
                id: item.month,
                label: item.month,
                value: Number(item[selected.key] || 0),
                color: monthColors[index % monthColors.length],
              }));
              const hasData = chartData.some((item) => item.value > 0);

              return (
                <div className={styles.sliderContainer}>
                  <h3 style={{ textAlign: 'center' }}>{selected.title}</h3>
                    {hasData ? (
                      <DonutChart data={chartData} size={100} innerRadius={0.55} colors={monthColors} />
                    ) : (
                      <div className={styles.noData}>{selected.emptyMessage}</div>
                    )}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button onClick={() => setYSlide((yIdxLocal - 1 + slides.length) % slides.length)} style={{ fontSize: 18, padding: '4px 12px' }}>◀</button>
                    <span style={{ fontWeight: 'bold' }}>{yIdxLocal + 1} / {slides.length}</span>
                    <button onClick={() => setYSlide((yIdxLocal + 1) % slides.length)} style={{ fontSize: 18, padding: '4px 12px' }}>▶</button>
                  </div>
                </div>
              );
            })()}
        </div>

        <div className={styles.recentList}>
            <h3>Citas recientes (últimos 7 días)</h3>
            <ul>
              {(stats.recentAppointments || []).map((a) => (
                <li key={a._id}>
                  <strong>{a.clientName || '—'}</strong> — {a.requestedDate ? new Date(a.requestedDate).toLocaleString() : '—'} — {a.status || '—'}
                </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;