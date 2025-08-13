import React, { useEffect, useState } from "react";
import type { Appointment } from "../types";
import { loadAppointments, saveAppointments } from "../utils/localStorage";
import { doctors } from "../data/doctors";
import { AppointmentContext } from "./AppointmentContext";

/**
 * AppointmentProvider component wraps the application with context state and functions
 * related to appointment management. It handles all CRUD operations and slot availability logic.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to be wrapped with context.
 * @returns {JSX.Element} Provider component with appointment-related state and handlers.
 */
export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(
    loadAppointments()
  );

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Load appointments from localStorage on initial render
  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  // Persist appointments to localStorage whenever they change
  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  /**
   * Adds a new appointment and saves to localStorage
   * @param {Appointment} appointment - Appointment to be added
   */
  const addAppointment = (appointment: Appointment) => {
    const updated = [...appointments, appointment];
    setAppointments(updated);
    saveAppointments(updated);
  };

  /**
   * Updates an existing appointment and saves to localStorage
   * @param {Appointment} updatedAppt - Updated appointment object
   */
  const updateAppointment = (updatedAppt: Appointment) => {
    const updated = appointments.map((a) =>
      a.id === updatedAppt.id ? updatedAppt : a
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  /**
   * Deletes an appointment by ID and saves to localStorage
   * @param {string} id - ID of the appointment to delete
   */
  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    saveAppointments(updated);
  };

  /**
   * Returns available time slots for a doctor on a specific date
   * @param {string} doctorId - ID of the selected doctor
   * @param {string} date - Selected date
   * @returns {string[]} Array of available slot strings
   */
  const getAvailableSlots = (doctorId: string, date: string): string[] => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return [];

    const bookedSlots = appointments
      .filter((appt) => appt.doctorId === doctorId && appt.date === date)
      .map((appt) => appt.slot);

    return doctor.availableSlots.filter((slot) => !bookedSlots.includes(slot));
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        selectedAppointment,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        setSelectedAppointment,
        getAvailableSlots,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
