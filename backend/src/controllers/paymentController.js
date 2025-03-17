const asyncHandler = require('express-async-handler');
const { createOrder, capturePayment } = require('../utils/paypal');
const Campaign = require('../models/campaignModel');

// @desc    Create PayPal order
// @route   POST /api/payments/paypal/create-order
// @access  Private
const createPayPalOrder = asyncHandler(async (req, res) => {
  const { amount, campaignId } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  // Check if campaign exists
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  try {
    // Create PayPal order
    const order = await createOrder(
      amount,
      'USD',
      `Donation to ${campaign.title}`
    );

    res.json(order);
  } catch (error) {
    console.error('PayPal create order error:', error);
    res.status(500);
    throw new Error('Failed to create PayPal order');
  }
});

// @desc    Capture PayPal payment
// @route   POST /api/payments/paypal/capture-order
// @access  Private
const capturePayPalOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  try {
    // Capture PayPal payment
    const captureData = await capturePayment(orderId);
    
    res.json(captureData);
  } catch (error) {
    console.error('PayPal capture payment error:', error);
    res.status(500);
    throw new Error('Failed to capture PayPal payment');
  }
});

// @desc    Get PayPal client ID
// @route   GET /api/payments/paypal/config
// @access  Public
const getPayPalConfig = asyncHandler(async (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID,
  });
});

module.exports = {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalConfig,
}; 