import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

const router = express.Router();

/**
 * @route POST /api/bookings
 * @desc Create a new booking (Guests only)
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { propertyId, startDate, endDate } = req.body;

    // Ensure the property exists
    const property = await Property.findByPk(propertyId);
    if (!property || !property.availability) {
      return res.status(400).json({ message: "Property not available" });
    }

    // Create a new booking
    const newBooking = await Booking.create({
      guestId: req.user.id,
      propertyId,
      startDate,
      endDate,
      paymentStatus: "pending", // Payment will be processed later
    });

    // Optionally mark property as unavailable
    await property.update({ availability: false });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error });
  }
});

export default router;
