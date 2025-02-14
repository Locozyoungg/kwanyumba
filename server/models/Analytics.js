import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // "search", "booking", "payment"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: String }, // City or area searched/booked
  searchFilters: { type: Object }, // Price range, amenities, etc.
  timestamp: { type: Date, default: Date.now },
});

router.get("/user-retention", adminAuth, async (req, res) => {
    try {
      const retentionData = await Analytics.aggregate([
        { $match: { eventType: "booking" } },
        { $group: { _id: "$userId", bookingCount: { $sum: 1 } } },
        { $match: { bookingCount: { $gt: 1 } } }, // Users who booked more than once
        { $count: "repeatUsers" },
      ]);
  
      const totalUsers = await Analytics.distinct("userId", { eventType: "booking" });
  
      const retentionRate = totalUsers.length
        ? (retentionData[0]?.repeatUsers || 0) / totalUsers.length
        : 0;
  
      res.status(200).json({ retentionRate, repeatUsers: retentionData[0]?.repeatUsers || 0 });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/conversion-rate", adminAuth, async (req, res) => {
    try {
      const searches = await Analytics.countDocuments({ eventType: "search" });
      const bookings = await Analytics.countDocuments({ eventType: "booking" });
  
      const conversionRate = searches ? (bookings / searches) * 100 : 0;
  
      res.status(200).json({ searches, bookings, conversionRate });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
router.get("/search-trends", adminAuth, async (req, res) => {
    try {
      const trends = await Analytics.aggregate([
        { $match: { eventType: "search" } },
        { $group: { 
            _id: { $month: "$timestamp" }, 
            count: { $sum: 1 } 
        } },
        { $sort: { _id: 1 } }, // Sort by month
      ]);
  
      res.status(200).json(trends);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  const AnalyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: "House" },
    location: { type: String, required: true },
    bookingTime: { type: Date, default: Date.now },
  });
  
export default mongoose.model("Analytics", analyticsSchema);
