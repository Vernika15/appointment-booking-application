/**
 * appointmentsContext.ts
 * ----------------------
 * Global React Context + Type for managing appointment state/actions.
 * Consumed via the `useAppointments` hook and provided by `AppointmentProvider`.
 */

import { createContext } from "react";
import type { Appointment } from "../types";

/**
 * Shape of the global Appointments context.
 *
 * Exposes server-backed CRUD operations and derived helpers used by the UI.
 */
type AppointmentsCtx = {
  /** Current list of appointments (fetched from the backend). */
  appointments: Appointment[];

  /**
   * Create a new appointment (POST /api/appointments).
   * @param a - New appointment data (without `id`)
   * @returns Promise that resolves when the appointment has been created and state updated.
   */
  addAppointment: (a: Omit<Appointment, "id">) => Promise<void>;

  /**
   * Update an existing appointment (PUT /api/appointments/:id).
   * @param id - Appointment id to update
   * @param patch - Partial fields to update; the provider merges with existing before sending
   * @returns Promise that resolves when the appointment has been updated and state refreshed.
   */
  editAppointment: (id: string, patch: Partial<Appointment>) => Promise<void>;

  /**
   * Delete an appointment (DELETE /api/appointments/:id).
   * @param id - Appointment id to delete
   * @returns Promise that resolves when deletion completes and state is updated.
   */
  deleteAppointment: (id: string) => Promise<void>;

  /**
   * Compute available time slots for a given doctor on a specific date.
   * The provider implements this by subtracting already-booked slots for that
   * (doctorName, date) pair from the global slots list.
   *
   * @param doctorName - Human-readable doctor name (e.g., "Dr. A.P.J. Abdul")
   * @param date - ISO date string (YYYY-MM-DD)
   * @returns Array of slot labels (e.g., ["09:00 AM", "09:30 AM"])
   */
  getAvailableSlots: (doctorName: string, date: string) => string[];

  /** Loading state for the initial GET /api/appointments on app mount. */
  initialLoading: boolean;

  /**
   * Action-level loading state (e.g., while creating/updating).
   * NOTE: This is separate from `initialLoading` to avoid blocking the table render.
   */
  loading: boolean;

  /** Last error message produced by a fetch/mutation action, if any. */
  error: string | null;
};

/**
 * React Context to manage global appointment-related state and actions.
 *
 * Must be provided by `<AppointmentProvider>` and consumed via `useAppointments()`.
 * Default value is `null` to enforce usage within the provider.
 */
export const AppointmentContext = createContext<AppointmentsCtx | null>(null);
