import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
/**
 * User Model: Stores user details for guests, hosts, and admins.
 */
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID, // Unique identifier
    defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false, // Full name is required
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure unique emails
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure unique phone numbers
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Encrypted password storage
  },
  role: {
    type: DataTypes.ENUM("guest", "host", "admin"), // Define user roles
    defaultValue: "guest", // Default role is 'guest'
  },
}, { timestamps: true }); // Automatically track creation & update timestamps

export default User;
