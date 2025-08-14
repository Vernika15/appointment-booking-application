import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Connects to the MongoDB database using Mongoose.
 * If the connection fails, the server process will exit.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when the connection is successful
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the environment
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    // Log the successful connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any error during the connection attempt
    console.error("MongoDB connection failed:", error);

    // Exit the process with failure code
    process.exit(1);
  }
};

export default connectDB;
