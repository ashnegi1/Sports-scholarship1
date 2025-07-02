// Load environment variables
const dotenv = require('dotenv');
// Try to load .env file if it exists
// Log environment values for debuggingrname, '../../.env') });
console.log('Environment configuration:');
console.log(`PORT: ${process.env.PORT}`);
module.exports = {
  // Use an uncommon port to avoid conflicts
  PORT: process.env.PORT || 7777,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sports_scholarship',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  // Set to false to use real MongoDB instance
  USE_MEMORY_DB: process.env.USE_MEMORY_DB === 'true' || false
};