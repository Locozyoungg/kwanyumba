import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Render PostgreSQL
    },
  },
  logging: false, // Disable logging for cleaner console output
});

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully...");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Error:", error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };
