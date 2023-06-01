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
    keepAlive: true, // Keep socket connections alive
    keepAliveInitialDelay: 300000, // Wait 5 minutes before starting keepAlive
    connectTimeoutMS: 30000,
  });
