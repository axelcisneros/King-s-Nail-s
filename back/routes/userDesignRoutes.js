const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  uploadDesign,
  getMyDesigns,
  deleteMyDesign,
  getAllUserDesigns,
  deleteUserDesignByAdmin,
} = require('../controllers/userDesignController');
const { protect, admin } = require('../middleware/authMiddleware');

// use `upload` from config/cloudinary (multer memoryStorage)
// Ruta para que el admin vea todos los diseños
router.route('/all').get(protect, admin, getAllUserDesigns);

// Ruta para que el admin elimine un diseño cualquiera
router.route('/all/:id').delete(protect, admin, deleteUserDesignByAdmin);

// Rutas para el cliente logueado
router
  .route('/')
  .post(protect, upload.single('image'), uploadDesign) // Cliente sube su diseño
  .get(protect, getMyDesigns); // Cliente ve sus diseños

router.route('/:id').delete(protect, deleteMyDesign); // Cliente borra su diseño

module.exports = router;