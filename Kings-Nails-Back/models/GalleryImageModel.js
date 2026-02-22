const mongoose = require('mongoose');

const galleryImageSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: true },
    public_id: { type: String, required: true },
    isFeatured: { type: Boolean, required: true, default: false }, // Para el carrusel principal
  },
  {
    timestamps: true,
  }
);

// Middleware para eliminar de Cloudinary antes de eliminar de la DB
galleryImageSchema.pre(['findOneAndDelete', 'deleteOne'], async function() {
  try {
    const { cloudinary } = require('../config/cloudinary');
    const doc = await this.model.findOne(this.getQuery());
    
    if (doc && doc.public_id) {
      console.log('🗑️ Eliminando imagen de galería de Cloudinary:', doc.public_id);
      await cloudinary.uploader.destroy(doc.public_id);
      console.log('✅ Imagen de galería eliminada de Cloudinary exitosamente');
    }
  } catch (error) {
    console.error('❌ Error al eliminar imagen de galería de Cloudinary:', error);
    // No bloquear la eliminación de la DB si falla Cloudinary
  }
});

const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);

module.exports = GalleryImage;