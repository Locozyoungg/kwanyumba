import Booking from "../models/Booking.js";
import Blacklist from "../models/Blacklist.js";

export const detectFraud = async (userId, ip, device) => {
  const lastHour = new Date(Date.now() - 60 * 60 * 1000);

  // Check for multiple bookings from the same IP or device
  const recentBookings = await Booking.find({
    $or: [{ ip }, { device }],
    createdAt: { $gte: lastHour },
  });

  if (recentBookings.length > 5) {
    return { fraud: true, reason: "Multiple bookings from same IP/device" };
  }

  // Check for high-value bookings from a new user
  const userBookings = await Booking.find({ userId });
  if (userBookings.length === 1 && recentBookings[0].amount > 50000) {
    return { fraud: true, reason: "High-value first-time booking" };
  }

  return { fraud: false };
};

export const handleFraudulentUser = async (userId, reason) => {
    await Blacklist.findOneAndUpdate(
      { userId },
      { reason, createdAt: new Date() },
      { upsert: true }
    );
  };