import { createContext } from "react";
import type { AppointmentContextType } from "../types";

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
export const AppointmentContext = createContext<AppointmentContextType | null>(
  null
);
