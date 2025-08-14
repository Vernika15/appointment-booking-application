import { Request, Response } from "express";
import { Appointment } from "../models/appointmentModel";

/**
 * @desc    Get all appointments
 * @route   GET /api/appointments
 * @access  Public
 */
export const getAppointments = async (_req: Request, res: Response) => {
  try {
    // Fetch all appointment records from MongoDB
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error });
  }
};

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Public
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { name, doctorId, doctorName, date, slot, purpose } = req.body;

    // Create a new appointment document
    const newAppointment = new Appointment({
      name,
      doctorId,
      doctorName,
      date,
      slot,
      purpose,
    });

    // Save the document to the database
    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment", error });
  }
};

/**
 * @desc    Update an existing appointment
 * @route   PUT /api/appointments/:id
 * @access  Public
 */
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find appointment by ID and update with new values
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // return updated document
        runValidators: true, // run schema validations
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

/**
 * @desc    Delete an appointment by ID
 * @route   DELETE /api/appointments/:id
 * @access  Public
 */
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find appointment by ID and delete
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
