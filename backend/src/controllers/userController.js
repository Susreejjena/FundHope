const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt for email:', email);
  
  // Validation
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    console.log('Login failed: User not found with email:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }
  
  console.log('User found, checking password match');
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  
  if (isMatch) {
    console.log('Login successful for user:', user._id);
    
    // Create response object without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    };
    
    console.log('Sending back user data with token');
    res.json(userResponse);
  } else {
    console.log('Login failed: Password does not match for user:', user._id);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('campaigns donations');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      bio: user.bio,
      campaigns: user.campaigns,
      donations: user.donations,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.avatar = req.file.path;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email');
  }
  
  // Generate and set password reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Set token and expiry on user model
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  await user.save();
  
  // In a real application, you would send an email with the token
  // For demo purposes, we'll just return the token
  
  res.json({
    message: 'Password reset link sent to email',
    resetToken: resetToken,
  });
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get token from params and hash it
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  
  // Find user by token and check if token is expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }
  
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();
  
  res.json({ message: 'Password reset successful' });
});

// @desc    Verify email
// @route   GET /api/users/verify/:verificationToken
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // In a real implementation, this would verify the user's email using a token
  // For our demo, we'll just return a success message
  
  res.json({ message: 'Email verified successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
}; 