import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import { sendPayoutToHost } from "../services/ncbaPayoutService.js";

const router = express.Router();

/**
 * @route POST /api/bookings
 * @desc Create a new booking (Guests only)
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { propertyId, startDate, endDate, hostPhoneNumber, bookingAmount } = req.body;

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

/**
 * @route POST /api/bookings/confirm-booking
 * @desc Confirm booking and send payout to host
 */
router.post("/confirm-booking", async (req, res) => {
  try {
    const { bookingId, hostPhoneNumber, bookingAmount } = req.body;

    // Calculate commission (KES 500 for KES 2500 booking, extrapolated upwards)
    const commissionRate = 500 / 2500; // 20%
    const commission = bookingAmount * commissionRate;
    const payoutAmount = bookingAmount - commission;

    // Send payout to host
    const payoutResponse = await sendPayoutToHost(hostPhoneNumber, payoutAmount, bookingId);

    res.json({
      message: "Booking confirmed and payout sent",
      payoutDetails: payoutResponse
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
