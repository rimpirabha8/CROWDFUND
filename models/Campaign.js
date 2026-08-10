const mongoose = require('mongoose');

const rewardTierSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  estimatedDelivery: { type: String, default: 'Within 30 days' },
  backersCount: { type: Number, default: 0 }
});

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a campaign title'],
      trim: true
    },
    tagline: {
      type: String,
      required: [true, 'Please add a short tagline'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a full campaign description']
    },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Creative Art', 'Gaming', 'Community', 'Green Tech', 'Health & Fitness', 'Education'],
      default: 'Technology'
    },
    targetGoal: {
      type: Number,
      required: [true, 'Please set a funding target goal']
    },
    currentAmount: {
      type: Number,
      default: 0
    },
    deadline: {
      type: Date,
      required: [true, 'Please set a funding deadline']
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80'
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'successful', 'ended'],
      default: 'active'
    },
    backersCount: {
      type: Number,
      default: 0
    },
    rewards: [rewardTierSchema],
    updates: [updateSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
