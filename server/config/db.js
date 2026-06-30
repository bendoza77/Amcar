const mongoose = require("mongoose");

/**
 * connectDB — establishes the single shared Mongoose connection used across the
 * app. Reads MONGO_URI from the environment. Exits the process on failure so we
 * never serve traffic against a dead database.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set — cannot start without a database.");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected."));
  mongoose.connection.on("error", (e) => console.error("MongoDB error:", e.message));
}

module.exports = connectDB;
