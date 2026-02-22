const express = require('express');
const router = express.Router();
const {
  createReview,
  getApprovedReviews,
  getMyReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Ruta pública para ver reseñas aprobadas
router.route('/').get(getApprovedReviews);

// Ruta privada para que un cliente cree una reseña
router.route('/').post(protect, createReview);

// Ruta privada para que un usuario obtenga sus reseñas (incluye no aprobadas)
router.route('/my').get(protect, getMyReviews);

// Rutas privadas para que el admin gestione las reseñas
router.route('/all').get(protect, admin, getAllReviews);
router.route('/:id/approve').put(protect, admin, approveReview);
router.route('/:id').delete(protect, admin, deleteReview);

module.exports = router;