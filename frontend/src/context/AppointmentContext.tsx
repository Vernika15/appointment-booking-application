import { createContext } from "react";
import type { Appointment } from "../types";

type AppointmentsCtx = {
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, "id">) => Promise<void>;
  editAppointment: (id: string, patch: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  getAvailableSlots: (doctorName: string, date: string) => string[];
  initialLoading: boolean;
  loading: boolean;
  error: string | null;
};

/**
 * React Context to manage global appointment-related state and actions.
 *
 * This context provides access to functions like:
 * - `addAppointment`
 * - `updateAppointment`
 * - `deleteAppointment`
 * - `getAvailableSlots`
 * - and state like `appointments` and `selectedAppointment`.
 *
 * It should be consumed using the `useAppointments` hook and must be
 * wrapped inside `AppointmentProvider`.
 */
export const AppointmentContext = createContext<AppointmentsCtx | null>(null);
