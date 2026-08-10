const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Please specify contribution amount']
    },
    rewardTitle: {
      type: String,
      default: 'Custom Pledge'
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'refunded'],
      default: 'completed'
    },
    transactionId: {
      type: String,
      default: () => 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contribution', contributionSchema);
