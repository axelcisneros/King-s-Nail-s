import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ClientAppointmentsPage.module.css';
import appointmentService from '../../services/appointmentService';
import AppointmentList from '../../components/AppointmentList/AppointmentList';
import ConfirmToast from '../../components/ConfirmToast/ConfirmToast';
import reviewService from '../../services/reviewService';
import Modal from '../../components/Modal/Modal';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import RescheduleModal from '../../components/RescheduleModal/RescheduleModal';

const ClientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState('');
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const fetchMyReviews = async () => {
    try {
      const data = await reviewService.getMyReviews();
      setMyReviews(data);
    } catch {
      // fail silently in UI; toast or UI can show errors if desired
    }
  };

  // --- Lógica de Citas ---
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const data = await appointmentService.getMyAppointments();
      // Ordenar citas por fecha, de más reciente a más antigua
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(data);
    } catch {
      setErrorAppointments('No se pudieron cargar tus citas.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    const onConfirm = async () => {
      try {
        await appointmentService.cancelMyAppointment(id);
        toast.success('Cita cancelada correctamente.');
        fetchAppointments(); // Refrescar la lista
      } catch (err) {
        toast.error(err.toString());
      }
    };

    toast(<ConfirmToast onConfirm={onConfirm} message="Estás segura de que quieres cancelar esta cita?" />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      position: 'top-center',
    });
  };

  const handleOpenReviewModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedAppointmentId(null);
    setReviewModalOpen(false);
  };

  const handleOpenRescheduleModal = (appointmentId) => {
    const appointment = appointments.find(app => app._id === appointmentId);
    if (!appointment) {
      toast.error('No se pudo encontrar la cita para reagendar.');
      return;
    }
    if (!appointment.date && !appointment.requestedDate) {
      toast.error('La cita no tiene una fecha válida para reagendar.');
      return;
    }
    setSelectedAppointmentForReschedule(appointment);
    setRescheduleModalOpen(true);
  };

  const handleCloseRescheduleModal = () => {
    setSelectedAppointmentForReschedule(null);
    setRescheduleModalOpen(false);
    setIsRescheduling(false);
  };

  const handleConfirmReschedule = async (appointmentId, newDate) => {
    try {
      setIsRescheduling(true);
      const result = await appointmentService.rescheduleAppointment(appointmentId, newDate);
      toast.success(`Cita reagendada correctamente. Nueva fecha: ${result.newDate}`);
      fetchAppointments(); // Refrescar la lista
      handleCloseRescheduleModal();
    } catch (err) {
      toast.error(err.toString());
      setIsRescheduling(false);
    }
  };

  const handleReviewSuccess = (createdReview, appointmentIdWhenDuplicate) => {
    // createdReview is the object returned by the backend after creating the review
    handleCloseReviewModal();
    toast.success('¡Gracias por tu reseña! Será visible públicamente una vez que sea aprobada.');
    // Añadir la reseña creada a mis reseñas
    if (createdReview) {
      setMyReviews((prev) => [createdReview, ...prev]);
      // Marcar la cita correspondiente como reseñada
      const appointmentIdFromReview = createdReview.appointment || createdReview.appointment?._id;
      if (appointmentIdFromReview) {
        setAppointments((prev) => prev.map((a) => (a._id === appointmentIdFromReview ? { ...a, hasReview: true } : a)));
        // Refrescar desde el servidor para asegurar que la relación persisted esté presente
        fetchAppointments();
      }
    } else {
      // Si la reseña ya existía, se puede marcar la cita como reseñada y refrescar mis reseñas
      if (appointmentIdWhenDuplicate) {
        setAppointments((prev) => prev.map((a) => (a._id === appointmentIdWhenDuplicate ? { ...a, hasReview: true } : a)));
      }
      // Refrescar mis reseñas y las citas desde el servidor
      fetchMyReviews();
      fetchAppointments();
    }
  };

  useEffect(() => {
    fetchAppointments();
    // También cargar mis reseñas para mantener el contador y el estado sincronizados
    fetchMyReviews();
  }, []);

  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis Citas
          <span className={styles.reviewCount}>Reseñadas: {myReviews.length}</span>
          <span className={styles.totalCount}>
            <Link to='/citas' className={styles.heroButton}>
                Agendar Cita
            </Link>
            <Link to='/client/mis-cotizaciones' className={styles.heroButton}>
                Solicitar Cotización
            </Link>
          </span>
        </h2>
        {loadingAppointments && <p>Cargando citas...</p>}
        {errorAppointments && <p className={styles.error}>{errorAppointments}</p>}
        {!loadingAppointments && !errorAppointments && (
          <AppointmentList
            appointments={appointments}
            onCancel={handleCancelAppointment}
            onReview={handleOpenReviewModal}
            onReschedule={handleOpenRescheduleModal}
          />
        )}
      </div>
      {isReviewModalOpen && (
        <Modal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal}>
          <ReviewForm
            appointmentId={selectedAppointmentId}
            onReviewSuccess={handleReviewSuccess}
          />
        </Modal>
      )}
      {isRescheduleModalOpen && selectedAppointmentForReschedule && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={handleCloseRescheduleModal}
          onConfirm={handleConfirmReschedule}
          appointment={selectedAppointmentForReschedule}
          isLoading={isRescheduling}
        />
      )}
    </>
  );
}

export default ClientAppointmentsPage;