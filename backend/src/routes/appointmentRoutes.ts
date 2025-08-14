import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController";

// Initialize Express router
const router = express.Router();

/**
 * @route   GET /api/appointments
 * @desc    Fetch all appointments
 * @access  Public
 */
router.get("/", getAppointments);

/**
 * @route   POST /api/appointments
 * @desc    Create a new appointment
 * @access  Public
 */
router.post("/", createAppointment);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update an existing appointment by ID
 * @access  Public
 */
router.put("/:id", updateAppointment);

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete an appointment by ID
 * @access  Public
 */
router.delete("/:id", deleteAppointment);

export default router;
