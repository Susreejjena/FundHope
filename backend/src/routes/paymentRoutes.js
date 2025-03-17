const express = require('express');
const router = express.Router();
const {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalConfig,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// PayPal routes
router.get('/paypal/config', getPayPalConfig);
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/capture-order', protect, capturePayPalOrder);

module.exports = router; 