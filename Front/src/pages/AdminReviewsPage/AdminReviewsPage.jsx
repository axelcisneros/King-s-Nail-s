import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AdminReviewTable from '../../components/AdminReviewTable/AdminReviewTable';
import styles from './AdminReviewsPage.module.css';
import { useConfirm } from '../../hooks/useConfirm';
import { toast } from 'react-toastify';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllReviews();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(data);
    } catch (err) {
      setError('No se pudieron cargar las reseñas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveReview(id);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: true } : r))
      );
      toast.success('Reseña aprobada');
    } catch (err) {
      toast.error(`Error al aprobar: ${err}`);
    }
  };

  const confirm = useConfirm();

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Confirmar eliminación', message: 'Estás segura de que quieres eliminar esta reseña permanentemente?', confirmText: 'Sí, eliminar', cancelText: 'Cancelar' });
    if (!ok) return;
    try {
      await adminService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success('Reseña eliminada');
    } catch (err) {
      toast.error(`Error al eliminar: ${err}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestionar Reseñas</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <AdminReviewTable reviews={reviews} onApprove={handleApprove} onDelete={handleDelete} />
      )}
      {/* confirmations handled by ConfirmProvider */}
    </div>
  );
};

export default AdminReviewsPage;