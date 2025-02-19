import { sequelize } from "./config/db.js";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Property from "./models/Property.js";
import Booking from "./models/Booking.js";
import Transaction from "./models/Transaction.js";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

/**
 * Sync database models.
 * The 'alter: true' option allows automatic table updates.
 */
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database Synced Successfully!");
  })
  .catch((error) => {
    console.error("❌ Error syncing database:", error);
  });

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Property routes
app.use("/api/properties", propertyRoutes);

//Booking routes
app.use("/api/bookings", bookingRoutes);

// Sync Database
sequelize.sync({ alter: true }).then(() => console.log("✅ Database Synced"));

// Connect to the database before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

