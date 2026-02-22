const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointment,
  deleteAppointment,
  cancelMyAppointment,
  rescheduleAppointment,
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, createAppointment) // Protegemos la ruta de creación
  .get(protect, admin, getAppointments);

// IMPORTANTE: Esta ruta debe ir ANTES de la ruta /:id
router.route('/my').get(protect, getMyAppointments);

// Ruta para que un cliente cancele su propia cita
router.route('/my/:id/cancel').put(protect, cancelMyAppointment);

// Ruta para reagendar citas (cliente sus propias citas, admin cualquier cita)
router.route('/:id/reschedule').put(protect, rescheduleAppointment);

router
  .route('/:id')
  .put(protect, admin, updateAppointment)
  .delete(protect, admin, deleteAppointment);

module.exports = router;