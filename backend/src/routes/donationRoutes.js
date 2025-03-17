const express = require('express');
const router = express.Router();
const {
  createDonation,
  getUserDonations,
  getDonationById,
  getCampaignDonations,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.route('/')
  .post(protect, createDonation)
  .get(protect, getUserDonations);

router.get('/:id', protect, getDonationById);

// Public routes
router.get('/campaign/:id', getCampaignDonations);

module.exports = router; 