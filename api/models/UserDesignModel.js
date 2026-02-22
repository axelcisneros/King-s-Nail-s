const mongoose = require('mongoose');

const userDesignSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para eliminar de Cloudinary antes de eliminar de la DB
userDesignSchema.pre(['findOneAndDelete', 'deleteOne'], async function() {
  try {
    const { cloudinary } = require('../config/cloudinary');
    const doc = await this.model.findOne(this.getQuery());
    
    if (doc && doc.public_id) {
      console.log('🗑️ Eliminando de Cloudinary:', doc.public_id);
      await cloudinary.uploader.destroy(doc.public_id);
      console.log('✅ Eliminado de Cloudinary exitosamente');
    }
  } catch (error) {
    console.error('❌ Error al eliminar de Cloudinary:', error);
    // No bloquear la eliminación de la DB si falla Cloudinary
  }
});

const UserDesign = mongoose.model('UserDesign', userDesignSchema);

module.exports = UserDesign;