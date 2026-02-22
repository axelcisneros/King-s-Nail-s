const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Appointment = require('../models/AppointmentModel');

// @desc    Crear una nueva reseña
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  // 1. Verificar que la cita exista y pertenezca al usuario
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    res.status(404);
    throw new Error('Cita no encontrada.');
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('No autorizado para reseñar esta cita.');
  }

  // 2. Verificar que la cita esté completada
  if (appointment.status !== 'completed') {
    res.status(400);
    throw new Error('Solo puedes dejar una reseña para citas completadas.');
  }

  // 3. Crear la reseña (el modelo ya previene duplicados por cita)
  // Evitar duplicados: si ya existe una reseña para esta cita, devolver un error legible
  const existing = await Review.findOne({ appointment: appointmentId });
  if (existing) {
    // Si la cita no tiene la referencia a la reseña, intentar vincularla ahora para mantener consistencia
    try {
      if (!appointment.review) {
        await Appointment.findByIdAndUpdate(appointment._id, { $set: { review: existing._id } });
      }
    } catch (linkErr) {
      console.error('Error al vincular reseña existente a la cita:', linkErr);
    }

    res.status(400);
    throw new Error('Ya existe una reseña para esta cita.');
  }

  const review = await Review.create({
    user: req.user._id,
    appointment: appointmentId,
    rating,
    comment,
  });

  // Vincular la reseña creada a la cita para que el frontend pueda detectar que la cita ya fue reseñada
  try {
    // Usar una actualización atómica para asegurar persistencia
    await Appointment.findByIdAndUpdate(appointment._id, { $set: { review: review._id } });
    // Leer la cita actualizada para verificar que el campo quedó persistido
    // No dejamos trazas de diagnóstico en la respuesta en producción
    await Appointment.findById(appointment._id).select('review').lean();
  } catch (err) {
    // No interrumpir el flow por un error secundario de persistencia de la cita
    console.error('No se pudo vincular la reseña a la cita:', err);
  }

  res.status(201).json(review);
});

// @desc    Obtener todas las reseñas APROBADAS (para mostrar públicamente)
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isApproved: true })
    .populate('user', 'name') // Solo mostrar el nombre del usuario
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Obtener las reseñas del usuario autenticado (incluye no aprobadas)
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Obtener TODAS las reseñas (para el panel de admin)
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Aprobar una reseña
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    review.isApproved = true;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Reseña no encontrada.');
  }
});

// @desc    Eliminar una reseña
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    await review.deleteOne();
    res.json({ message: 'Reseña eliminada.' });
  } else {
    res.status(404);
    throw new Error('Reseña no encontrada.');
  }
});

module.exports = {
  createReview,
  getApprovedReviews,
  getMyReviews,
  getAllReviews,
  approveReview,
  deleteReview,
};