import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

/**
 * Property Model: Stores details of rental listings.
 */
const Property = sequelize.define("Property", {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Property title is required
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // Description is required
  },
  pricePerNight: {
    type: DataTypes.FLOAT,
    allowNull: false, // Nightly rate is required
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false, // Property location is required
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Stores image URLs
    allowNull: true, // Optional field
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Property is available by default
  },
  hostId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Users", key: "id" }, // Foreign key linking to User (host)
  },
}, { timestamps: true });

// Define relationship: Each property belongs to a host (User)
Property.belongsTo(User, { foreignKey: "hostId", as: "host" });

export default Property;
