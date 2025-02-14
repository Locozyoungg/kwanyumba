import express from "express";
import Analytics from "../models/Analytics.js";
import { adminAuth } from "../middleware/auth.js"; // Only the creator should access

const router = express.Router();

router.get("/high-traffic", adminAuth, async (req, res) => {
  try {
    const data = await Analytics.aggregate([
      { $match: { eventType: "search" } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }, // Top 10 locations
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
