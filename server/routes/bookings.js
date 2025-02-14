import express from "express";
import Booking from "../models/Booking.js";
import Blacklist from "../models/Blacklist.js";
import { logAnalyticsEvent } from "../middleware/analyticsLogger.js";
import { detectFraud, handleFraudulentUser } from "../utils/fraudDetection.js";
import Analytics from "../models/Analytics.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, propertyId, location } = req.body;
    const newBooking = await Booking.create({ userId, propertyId });

    // Log booking event
    await logAnalyticsEvent("booking", userId, { location });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/book", userAuth, trackUserDevice, async (req, res) => {
  try {
    const { userId, houseId, amount } = req.body;

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

    const booking = new Booking({ userId, houseId, amount, ip: req.clientInfo.ip, device: req.clientInfo.device });
    await booking.save();

    res.status(201).json({ message: "Booking successful!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/book", userAuth, trackUserDevice, async (req, res) => {
    try {
      const { userId, houseId, amount } = req.body;
  
      const house = await House.findById(houseId);
      if (!house) {
        return res.status(404).json({ error: "House not found" });
      }
  
      const booking = new Booking({ userId, houseId, amount });
      await booking.save();
  
      // Log analytics data
      const analyticsData = new Analytics({
        userId,
        houseId,
        location: house.location,
      });
  
      await analyticsData.save();
  
      res.status(201).json({ message: "Booking successful!" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  

export default router;
