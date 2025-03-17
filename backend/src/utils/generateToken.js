const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  // Default to 30 days if JWT_EXPIRES_IN is not set
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
  
  // Make sure expiresIn is a valid value
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

module.exports = generateToken; 