const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Opcional, si el cliente debe estar registrado
    },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    service: { type: String, required: true },
    requestedDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: { type: String },
    designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDesign',
      },
    ],
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
    cancelledBy: {
      type: String,
      enum: ['client', 'admin'],
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual para compatibilidad con código que usa 'date'
appointmentSchema.virtual('date').get(function() {
  return this.requestedDate;
});

appointmentSchema.virtual('date').set(function(value) {
  this.requestedDate = value;
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;