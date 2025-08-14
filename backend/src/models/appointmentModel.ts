import mongoose from "mongoose";

/**
 * @description Mongoose schema for an appointment document
 *
 * Fields:
 * - name: Name of the patient
 * - doctorId: ID of the selected doctor
 * - doctorName: Name of the selected doctor
 * - date: Appointment date in YYYY-MM-DD format
 * - slot: Time slot selected for the appointment
 * - purpose: Reason/purpose for the appointment
 *
 * Timestamps: Automatically adds `createdAt` and `updatedAt` fields
 */
const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    purpose: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt timestamps automatically
  }
);

/**
 * @description Mongoose model for appointments collection
 */
export const Appointment = mongoose.model("Appointment", appointmentSchema);
