import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Booking from "./Booking.js";

/**
 * Transaction Model: Stores payment details.
 */
const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Bookings", key: "id" }, // Links to the booking
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false, // Payment amount
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "successful", "failed"), 
    defaultValue: "pending", // Default payment status
  },
  mpesaReceipt: {
    type: DataTypes.STRING,
    unique: true, // Ensure each M-Pesa receipt is unique
    allowNull: true, // Only filled if payment is successful
  },
}, { timestamps: true });

// Define relationship: Each transaction belongs to a booking
Transaction.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

export default Transaction;
