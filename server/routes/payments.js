import FraudLog from "../models/FraudLog.js";
import axios from "axios";

router.post("/payment/fail", userAuth, async (req, res) => {
  try {
    const { userId, reason } = req.body;

    const fraudEntry = new FraudLog({ userId, reason });
    await fraudEntry.save();

    res.status(201).json({ message: "Fraudulent activity logged." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/payment/verify", userAuth, async (req, res) => {
    try {
      const { transactionId, userId, houseId, amount } = req.body;
  
      // Verify with M-Pesa API
      const response = await axios.post("https://mpesa-api.com/verify", {
        transactionId,
      });
  
      if (!response.data.success || response.data.amount !== amount) {
        return res.status(400).json({ error: "Payment mismatch detected!" });
      }
  
      // Confirm the booking
      await Booking.findOneAndUpdate(
        { transactionId },
        { status: "confirmed" }
      );
  
      res.status(200).json({ message: "Payment verified, booking confirmed!" });
    } catch (error) {
      res.status(500).json({ error: "Payment verification failed." });
    }
  });
  