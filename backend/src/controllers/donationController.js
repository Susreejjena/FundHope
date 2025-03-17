const asyncHandler = require('express-async-handler');
const Donation = require('../models/donationModel');
const Campaign = require('../models/campaignModel');
const User = require('../models/userModel');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private
const createDonation = asyncHandler(async (req, res) => {
  const { campaignId, amount, message, isAnonymous, paymentId, paymentMethod } = req.body;

  // Check if campaign exists
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  // Check if campaign is active
  if (campaign.status !== 'active') {
    res.status(400);
    throw new Error('Campaign is not active');
  }

  // Create donation
  const donation = await Donation.create({
    user: req.user._id,
    campaign: campaignId,
    amount,
    message,
    isAnonymous,
    paymentId,
    paymentMethod,
    status: 'completed', // Assuming payment is already completed through PayPal
  });

  if (donation) {
    res.status(201).json(donation);
  } else {
    res.status(400);
    throw new Error('Invalid donation data');
  }
});

// @desc    Get user donations
// @route   GET /api/donations
// @access  Private
const getUserDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user._id })
    .populate('campaign', 'title image')
    .sort({ createdAt: -1 });

  res.json(donations);
});

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id)
    .populate('campaign', 'title image goal raised')
    .populate('user', 'name email');

  // Check if donation exists
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Check if user has permission to view this donation
  if (donation.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to access this donation');
  }

  res.json(donation);
});

// @desc    Get campaign donations
// @route   GET /api/donations/campaign/:id
// @access  Public
const getCampaignDonations = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const count = await Donation.countDocuments({ 
    campaign: req.params.id,
    status: 'completed'
  });

  const donations = await Donation.find({ 
    campaign: req.params.id,
    status: 'completed'
  })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Filter out user data for anonymous donations
  const processedDonations = donations.map(donation => {
    if (donation.isAnonymous) {
      return {
        ...donation._doc,
        user: { name: 'Anonymous' }
      };
    }
    return donation;
  });

  res.json({
    donations: processedDonations,
    page,
    pages: Math.ceil(count / pageSize),
    totalDonations: count,
  });
});

module.exports = {
  createDonation,
  getUserDonations,
  getDonationById,
  getCampaignDonations,
}; 