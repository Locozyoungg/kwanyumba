// File: routes/propertyRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import Property from "../models/Property.js"; // Ensure this model exists

const router = express.Router();

/**
 * @route GET /api/properties
 * @desc Fetch all properties (Public)
 */
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().populate("host"); // Mongoose version
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * @route POST /api/properties
 * @desc Create a new property (Only Hosts & Admins)
 */
router.post("/", verifyToken, authorizeRoles("host", "admin"), async (req, res) => {
  try {
    const { title, location, price } = req.body;
    
    if (!title || !location || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProperty = new Property({
      title,
      location,
      price,
      host: req.user.id, // Assign property to logged-in host
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: "Failed to create property", error });
  }
});

export default router;
