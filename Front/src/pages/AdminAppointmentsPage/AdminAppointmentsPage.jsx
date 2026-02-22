import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AdminAppointmentTable from '../../components/AdminAppointmentTable/AdminAppointmentTable';
import styles from './AdminAppointmentsPage.module.css';
import { toast } from 'react-toastify';
import RescheduleModal from '../../components/RescheduleModal/RescheduleModal';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAppointments();
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(data);
    } catch (err) {
      setError('No se pudieron cargar las citas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateAppointmentStatus(id, newStatus);
      // Actualizar el estado localmente para reflejar el cambio instantáneamente
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      toast.error(`Error al actualizar: ${err}`);
    }
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
      const result = await adminService.rescheduleAppointment(appointmentId, newDate);
      toast.success(`Cita reagendada correctamente. Nueva fecha: ${result.newDate}`);
      fetchAllAppointments(); // Refrescar la lista
      handleCloseRescheduleModal();
    } catch (err) {
      toast.error(err.toString());
      setIsRescheduling(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestionar Citas</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <AdminAppointmentTable
          appointments={appointments}
          onStatusChange={handleStatusChange}
          onReschedule={handleOpenRescheduleModal}
        />
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
    </div>
  );
};export default AdminAppointmentsPage;