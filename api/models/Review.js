const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    appointment: {
      // Para vincular la reseña a un servicio específico y evitar spam
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appointment',
      unique: true, // Asegura que solo haya una reseña por cita
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Las reseñas no son públicas hasta que la admin las apruebe
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
module.exports = Review;