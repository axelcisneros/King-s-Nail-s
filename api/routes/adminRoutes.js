const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, setUserRole } = require('../controllers/adminController');
const { getStats } = require('../controllers/adminStatsController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/users
// @access  Private/Admin
router.route('/users').get(protect, admin, getUsers);

// @route   GET /api/admin/stats
// Devuelve métricas para el panel de administración
router.route('/stats').get(protect, admin, getStats);

// Ruta pública temporal para pruebas locales (no usar en producción)
router.route('/stats/public').get(getStats);

// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.route('/users/:id').delete(protect, admin, deleteUser);

// @route   PATCH /api/admin/users/:id/role
// @access  Private/SuperAdmin
router.route('/users/:id/role').patch(protect, superAdmin, setUserRole);

module.exports = router;
