import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import Property from "./Property.js";

/**
 * Booking Model: Tracks rental reservations.
 */
const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Users", key: "id" }, // Guest ID (User who booked)
  },
  propertyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Properties", key: "id" }, // Property being booked
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false, // Check-in date is required
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false, // Check-out date is required
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "canceled"), 
    defaultValue: "pending", // Default status is pending
  },
}, { timestamps: true });

// Define relationships
Booking.belongsTo(User, { foreignKey: "userId", as: "guest" });
Booking.belongsTo(Property, { foreignKey: "propertyId", as: "property" });

export default Booking;
