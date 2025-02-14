import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create a new Sequelize instance with PostgreSQL credentials
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Disable logging for cleaner console output
  }
);

// Function to establish a database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully...");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Error:", error.message);
    console.error("🔍 Full Error Details:", error); // Log full error for debugging
    process.exit(1); // Exit process with failure
  }
};

export { sequelize, connectDB };
