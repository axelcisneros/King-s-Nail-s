const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema(
  {
    clientName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;