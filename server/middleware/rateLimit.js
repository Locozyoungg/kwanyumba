export const limitBookingAttempts = async (req, res, next) => {
    const { userId } = req.body;
  
    const lastBooking = await Booking.findOne({ userId }).sort({ createdAt: -1 });
  
    if (lastBooking) {
      const timeElapsed = (Date.now() - lastBooking.createdAt) / (1000 * 60); // in minutes
      if (timeElapsed < 60) {
        return res.status(429).json({ error: "You can only book once per hour." });
      }
    }
    next();
  };
  