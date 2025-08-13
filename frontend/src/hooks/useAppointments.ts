import { useContext } from "react";
import { AppointmentContext } from "../context/AppointmentContext";
import type { AppointmentContextType } from "../types";

/**
 * Custom hook to access the Appointment context.
 *
 * @returns {AppointmentContextType} The appointment context containing state and actions.
 * @throws Will throw an error if used outside of the AppointmentProvider.
 *
 * @example
 * const { appointments, addAppointment } = useAppointments();
 */
export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return context;
};
