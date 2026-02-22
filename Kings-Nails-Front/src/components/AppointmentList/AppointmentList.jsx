import PropTypes from 'prop-types';
import AppointmentItem from '../AppointmentItem/AppointmentItem';
import styles from './AppointmentList.module.css';

const AppointmentList = ({ appointments, onCancel, onReview, onReschedule }) => {
  if (appointments.length === 0) {
    return <p className={styles.noAppointments}>Aún no tienes citas agendadas.</p>;
  }

  return (
    <div className={styles.listContainer}>
      {appointments.map((appointment) => (
        <AppointmentItem
          key={appointment._id}
          appointment={appointment}
          onCancel={onCancel}
          onReview={onReview}
          onReschedule={onReschedule}
        />
      ))}
    </div>
  );
};

AppointmentList.propTypes = {
  appointments: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
};

export default AppointmentList;