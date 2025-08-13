import React, { useEffect, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { doctors } from "../data/doctors";
import { generateId } from "../utils/id";

/**
 * AppointmentForm component allows users to book a new appointment
 * or update an existing one. It provides dynamic doctor availability
 * and form validation.
 */
export const AppointmentForm: React.FC = () => {
  const {
    addAppointment,
    updateAppointment,
    selectedAppointment,
    setSelectedAppointment,
    getAvailableSlots,
  } = useAppointments();

  // Form state variables
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [slot, setSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  /**
   * useEffect to update available slots when doctor or date changes.
   * Also includes selected slot if editing an appointment.
   */
  useEffect(() => {
    if (doctorId && date) {
      const slots = getAvailableSlots(doctorId, date);

      // When editing, re-add the current slot to the list
      if (
        selectedAppointment?.slot &&
        selectedAppointment.doctorId === doctorId &&
        selectedAppointment.date === date
      ) {
        slots.push(selectedAppointment.slot);
        slots.sort();
      }

      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [doctorId, date, selectedAppointment]);

  /**
   * useEffect to populate form fields when an appointment is selected for editing.
   */
  useEffect(() => {
    if (selectedAppointment) {
      setName(selectedAppointment.name);
      setDate(selectedAppointment.date);
      setDoctorId(selectedAppointment.doctorId);
      setSlot(selectedAppointment.slot);
      setPurpose(selectedAppointment.purpose);
    }
  }, [selectedAppointment]);

  /**
   * Resets all form fields and clears selected appointment.
   */
  const resetForm = () => {
    setName("");
    setDate("");
    setDoctorId("");
    setSlot("");
    setPurpose("");
    setAvailableSlots([]);
    setSelectedAppointment(null);
  };

  /**
   * Handles form submission for both creating and updating an appointment.
   *
   * @param e - React form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return;

    const appointment = {
      id: selectedAppointment ? selectedAppointment.id : generateId(),
      name,
      date,
      doctorId,
      doctorName: doctor.name,
      slot,
      purpose,
    };

    if (selectedAppointment) {
      updateAppointment(appointment);
    } else {
      addAppointment(appointment);
    }

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>📝 Appointment Form</h3>

      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Doctor:
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Slot:
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          required
          disabled={!doctorId || !date}
        >
          <option value="">-- Select Doctor & Date First --</option>
          {availableSlots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        Purpose:
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </label>

      <button type="submit">
        {selectedAppointment ? "Update Appointment" : "Book Appointment"}
      </button>
    </form>
  );
};
