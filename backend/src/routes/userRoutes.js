const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/verify/:verificationToken', verifyEmail);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('avatar'), updateUserProfile);

module.exports = router; 