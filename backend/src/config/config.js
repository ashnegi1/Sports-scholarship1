// Load environment variables
const dotenv = require('dotenv');
const path = require('path');

// Try to load .env file if it exists
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Log environment values for debugging
console.log('Environment configuration:');
console.log(`PORT: ${process.env.PORT}`);
console.log(`USE_MEMORY_DB: ${process.env.USE_MEMORY_DB}`);

module.exports = {
  // Use an uncommon port to avoid conflicts
  PORT: process.env.PORT || 7777,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sports_scholarship',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  // Set to false to use real MongoDB instance
  USE_MEMORY_DB: false
}; 