const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDesign',
      },
    ],
    status: {
      type: String,
      enum: ['requested', 'quoted', 'accepted', 'declined', 'cancelled'],
      default: 'requested',
      required: true,
    },
    adminPrice: {
      type: Number,
    },
    adminComment: {
      type: String,
    },
    respondedAt: {
      type: Date,
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
