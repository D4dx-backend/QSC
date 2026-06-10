const mongoose = require("mongoose");

// Connect to MongoDB with automatic retry. We intentionally do NOT call
// process.exit() on failure: doing so kills the container on any transient
// Atlas hiccup (IP allowlist, cold start, network blip), which on a platform
// like DigitalOcean App Platform causes an endless crash-loop and a
// "no_healthy_upstream" 503 for every request (often misreported in the
// browser as a CORS error). Keeping the process alive lets the HTTP server
// and health-check endpoints stay up while Mongo reconnects in the background.
const connectDB = async (retryDelayMs = 5000) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("\x1b[36m%s\x1b[0m", `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("mongoose connection error", error.message);
    console.error(`Retrying MongoDB connection in ${retryDelayMs / 1000}s...`);
    setTimeout(() => connectDB(retryDelayMs), retryDelayMs);
  }
};

module.exports = connectDB;
