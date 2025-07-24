const app = require('./app');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Blog Platform API Server Running
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📊 API Base: /api/v1
🔗 Health Check: /api/v1/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  console.log('🔄 Shutting down server due to uncaught exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = server;
