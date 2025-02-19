import express from "express";
import dotenv from "dotenv";
import { sequelize, connectDB } from "./config/db.js"; // Import DB connection
import User from "./models/User.js";
import Property from "./models/Property.js";
import Booking from "./models/Booking.js";
import Transaction from "./models/Transaction.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);

// Ensure database connection before starting server
const startServer = async () => {
  try {
    console.log("⏳ Connecting to PostgreSQL...");
    await connectDB(); // Authenticate connection

    console.log("⏳ Syncing database models...");
    await sequelize.sync({ alter: true }); // Sync models dynamically

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1); // Exit on failure
  }
};

// Start the server
startServer();
app.get("/", (req, res) => {
  res.send("Kwanyumba API is running...");
});
