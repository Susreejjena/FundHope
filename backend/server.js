const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const net = require('net');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const campaignRoutes = require('./src/routes/campaignRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(err.stack);
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to MongoDB and start server
let PORT = process.env.PORT || 8080;
const MAX_PORT_ATTEMPTS = 10; // Try up to 10 ports before giving up
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fundhope';

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      resolve(false); // Port is not available
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // Port is available
    });
    
    server.listen(port);
  });
}

// Function to find an available port
async function findAvailablePort(startPort, maxAttempts) {
  let port = startPort;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    port++;
    attempts++;
  }
  
  throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
}

// Start the server with an available port
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      const availablePort = await findAvailablePort(PORT, MAX_PORT_ATTEMPTS);
      app.listen(availablePort, () => {
        PORT = availablePort; // Update the PORT variable
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Port error:', error.message);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
  }); 