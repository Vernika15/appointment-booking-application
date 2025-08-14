import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import appointmentRoutes from "./routes/appointmentRoutes";

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Define the server port from environment or fallback to 8081
const PORT = process.env.PORT || 8081;

// Middleware to parse JSON request bodies
app.use(express.json());

/**
 * @route   GET /
 * @desc    Root route to verify that server is running
 * @access  Public
 */
app.get("/", (_req, res) => {
  res.send("🚀 Appointment Booking Backend API");
});

// Mount appointment-related routes under /api/appointments
app.use("/api/appointments", appointmentRoutes);

/**
 * Connect to the database and start the server.
 * The server will only start listening after a successful DB connection.
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
