const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for your campaign'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for your campaign'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description for your campaign'],
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image for your campaign'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category for your campaign'],
      enum: [
        'Education',
        'Medical',
        'Disaster Relief',
        'Animal Welfare',
        'Environment',
        'Community',
        'Other',
      ],
    },
    goal: {
      type: Number,
      required: [true, 'Please provide a funding goal for your campaign'],
      min: [100, 'Funding goal must be at least 100'],
    },
    raised: {
      type: Number,
      default: 0,
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date for your campaign'],
      validate: {
        validator: function (val) {
          return val > new Date();
        },
        message: 'End date must be in the future',
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
    updates: [
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for progress percentage
campaignSchema.virtual('progress').get(function () {
  return this.goal > 0 ? Math.min((this.raised / this.goal) * 100, 100) : 0;
});

// Virtual field for days left
campaignSchema.virtual('daysLeft').get(function () {
  const today = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Update campaign status based on end date and goal
campaignSchema.pre('save', function (next) {
  const today = new Date();
  if (today > this.endDate) {
    this.status = 'completed';
  }
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign; 