const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const errorHandler = require('./middleware/error');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:8081', 'http://127.0.0.1:8081', 'http://localhost:8082', 'http://127.0.0.1:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sports Scholarship API (Real MongoDB)' });
});

// Error handler middleware
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB at:', config.MONGODB_URI);
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Make sure MongoDB is running on your machine or update the connection string');
    }
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB URI: ${config.MONGODB_URI}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer(); 