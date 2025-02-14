import express from "express";
import Booking from "../models/Booking.js";
import Blacklist from "../models/Blacklist.js";
import Analytics from "../models/Analytics.js";
import House from "../models/House.js";
import { logAnalyticsEvent } from "../middleware/analyticsLogger.js";
import { detectFraud, handleFraudulentUser } from "../utils/fraudDetection.js";
import { userAuth, trackUserDevice } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", userAuth, trackUserDevice, async (req, res) => {
  try {
    const { userId, houseId, amount, transactionId } = req.body;

    // Check if house exists
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Check if house is already booked
    const existingBooking = await Booking.findOne({ houseId, status: "confirmed" });
    if (existingBooking) {
      return res.status(400).json({ error: "This house is already booked." });
    }

    // Check for duplicate payment
    if (transactionId) {
      const duplicatePayment = await Booking.findOne({ transactionId });
      if (duplicatePayment) {
        return res.status(400).json({ error: "Duplicate payment detected." });
      }
    }

    // Check if user is blacklisted
    const blacklisted = await Blacklist.findOne({ userId });
    if (blacklisted) {
      return res.status(403).json({ error: "Your account has been restricted due to suspicious activity." });
    }

    // Run fraud detection
    const fraudCheck = await detectFraud(userId, req.clientInfo.ip, req.clientInfo.device);
    if (fraudCheck.fraud) {
      await handleFraudulentUser(userId, fraudCheck.reason);
      return res.status(403).json({ error: `Booking blocked: ${fraudCheck.reason}` });
    }

    // Create new booking
    const booking = new Booking({
      userId,
      houseId,
      amount,
      transactionId,
      status: "pending",
      ip: req.clientInfo.ip,
      device: req.clientInfo.device,
    });
    await booking.save();

    // Log analytics event
    await logAnalyticsEvent("booking", userId, { location: house.location });

    // Store analytics data
    const analyticsData = new Analytics({
      userId,
      houseId,
      location: house.location,
    });
    await analyticsData.save();

    res.status(201).json({ message: "Booking initiated, waiting for payment confirmation." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
