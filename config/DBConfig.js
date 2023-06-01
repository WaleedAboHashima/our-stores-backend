const mongoose = require("mongoose");
mongoose.set({ strictPopulate: false });

module.exports = () =>
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase timeout
    socketTimeoutMS: 45000, // Increase timeout
    family: 4, // Use IPv4, skip trying IPv6
    autoIndex: false, // Don'tbuild indexes
    poolSize: 10, // Maintain up to 10 socket connections
    bufferSize: 0, // Disable buffering
    keepAlive: true, // Keep socket connections alive
    keepAliveInitialDelay: 300000, // Wait 5 minutes before starting keepAlive
    connectTimeoutMS: 30000, // Timeout for initial connection
    retryAttempts: 10, // Retry up to 10 times
    retryDelay: 1000,
  });
