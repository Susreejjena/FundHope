const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide donation amount'],
      min: [1, 'Donation amount must be at least 1'],
    },
    message: {
      type: String,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'credit_card', 'other'],
      default: 'paypal',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update campaign raised amount after donation
donationSchema.post('save', async function (doc) {
  const Campaign = mongoose.model('Campaign');
  const User = mongoose.model('User');

  if (doc.status === 'completed') {
    // Update campaign raised amount
    await Campaign.findByIdAndUpdate(
      doc.campaign,
      { $inc: { raised: doc.amount } }
    );

    // Add donation to user's donations
    await User.findByIdAndUpdate(
      doc.user,
      { $push: { donations: doc._id } }
    );

    // Add donation to campaign's donations
    await Campaign.findByIdAndUpdate(
      doc.campaign,
      { $push: { donations: doc._id } }
    );
  }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation; 