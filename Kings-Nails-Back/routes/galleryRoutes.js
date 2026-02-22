const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');

// use `upload` from config/cloudinary (multer memoryStorage)
router
  .route('/')
  .get(getGalleryImages)
  .post(protect, admin, upload.single('image'), createGalleryImage);

router
  .route('/:id')
  .put(protect, admin, upload.single('image'), updateGalleryImage)
  .delete(protect, admin, deleteGalleryImage);

module.exports = router;