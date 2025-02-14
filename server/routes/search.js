import express from "express";
import Listing from "../models/Listing.js";
import { logAnalyticsEvent } from "../middleware/analyticsLogger.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { location, priceRange, amenities } = req.query;
    const listings = await Listing.find({ location, price: { $lte: priceRange } });

    // Log search event
    await logAnalyticsEvent("search", req.user?._id, {
      location,
      searchFilters: { priceRange, amenities },
    });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
