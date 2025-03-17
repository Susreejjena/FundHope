const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate,
  getUserCampaigns,
} = require('../controllers/campaignController');
const { protect, isCreator } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

// Public routes
router.get('/', getCampaigns);

// Protected routes
router.post('/', protect, upload.single('image'), createCampaign);
router.get('/user', protect, getUserCampaigns);

// Routes with path parameters
router.get('/:id', getCampaignById);
router.route('/:id')
  .put(protect, isCreator, upload.single('image'), updateCampaign)
  .delete(protect, isCreator, deleteCampaign);

// Campaign updates
router.post('/:id/updates', protect, isCreator, addCampaignUpdate);

module.exports = router; 