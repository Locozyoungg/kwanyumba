import express from "express";
import Analytics from "../models/Analytics.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Get most booked locations
router.get("/analytics/locations", adminAuth, async (req, res) => {
  try {
    const locationStats = await Analytics.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(locationStats);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get peak booking times
router.get("/analytics/peak-times", adminAuth, async (req, res) => {
  try {
    const peakTimes = await Analytics.aggregate([
      {
        $group: {
          _id: { $hour: "$bookingTime" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(peakTimes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get user retention & conversion rates
router.get("/analytics/user-retention", adminAuth, async (req, res) => {
  try {
    const returningUsers = await Analytics.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }, // Users with more than one booking
    ]);

    const totalUsers = await Analytics.distinct("userId");
    const retentionRate = (returningUsers.length / totalUsers.length) * 100;

    res.json({ retentionRate: retentionRate.toFixed(2) + "%" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get average search trends
router.get("/analytics/search-trends", adminAuth, async (req, res) => {
  try {
    const trendingSearches = await SearchHistory.aggregate([
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(trendingSearches);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
