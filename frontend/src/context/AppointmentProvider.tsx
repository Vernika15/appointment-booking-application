import React, { useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Appointment } from "../types";
import {
  createAppointment as apiCreateAppointment,
  fetchAppointments as apiFetchAppointments,
  updateAppointmentById as apiUpdateAppointment,
  deleteAppointmentById as apiDeleteAppointment,
} from "../services/appointments";
import { ALL_SLOTS } from "../data/doctors";
import { AppointmentContext } from "./AppointmentContext";

export type AppointmentsCtx = {
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
 * Provides appointment state/actions to all descendants.
 */
export const AppointmentProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // ---- State ----------------------------------------------------------------
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  /** Loading flag for the initial GET on mount (table skeleton/loading state). */
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  /** Loading flag for mutations (create/update). Keep separate from initialLoading. */
  const [loading, setLoading] = useState<boolean>(false);
  /** Last error message (read list or mutation). */
  const [error, setError] = useState<string | null>(null);

  // ---- Effects ---------------------------------------------------------------
  /**
   * On mount, fetch the appointment list from the server.
   */
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setInitialLoading(true);
        const list = await apiFetchAppointments();
        setAppointments(list);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Failed to load appointments");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // ---- Derived helpers -------------------------------------------------------
  /**
   * Compute available time slots for a given doctor and date.
   * Returns an empty list until both doctor and date are picked (UX parity).
   *
   * @param doctorName - Human-readable doctor name (e.g., "Dr. A.P.J. Abdul")
   * @param date - ISO date string (YYYY-MM-DD)
   * @returns array of available slot labels (e.g., ["09:00 AM", "09:30 AM"])
   */
  const getAvailableSlots: AppointmentsCtx["getAvailableSlots"] = (
    doctorName,
    date
  ) => {
    if (!doctorName || !date) return [];
    const booked = new Set(
      appointments
        .filter((a) => a.doctorName === doctorName && a.date === date)
        .map((a) => a.slot)
    );
    return ALL_SLOTS.filter((s) => !booked.has(s));
  };

  // ---- Actions ---------------------------------------------------------------
  /**
   * Create a new appointment (POST /api/appointments).
   * Prepends the created record to the list on success.
   */
  const addAppointment: AppointmentsCtx["addAppointment"] = async (a) => {
    setError(null);
    setLoading(true);
    try {
      const created = await apiCreateAppointment({
        name: a.name,
        doctorId: a.doctorId,
        doctorName: a.doctorName,
        date: a.date,
        slot: a.slot,
        purpose: a.purpose,
      });
      setAppointments((prev) => [created, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to create appointment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing appointment (PUT /api/appointments/:id).
   * Merges the incoming patch with the existing record to build a complete payload.
   */
  const editAppointment = async (id: string, patch: Partial<Appointment>) => {
    setError(null);
    setLoading(true);
    try {
      // merge with existing so required fields are always present
      const existing = appointments.find((a) => a.id === id);
      if (!existing) throw new Error("Appointment not found");

      const payload = {
        name: patch.name ?? existing.name,
        doctorId: patch.doctorId ?? existing.doctorId,
        doctorName: patch.doctorName ?? existing.doctorName,
        date: patch.date ?? existing.date,
        slot: patch.slot ?? existing.slot,
        purpose: patch.purpose ?? existing.purpose,
      };

      const updated = await apiUpdateAppointment(id, payload);
      setAppointments((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to update appointment");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete an appointment (DELETE /api/appointments/:id) and update state.
   */
  const deleteAppointment = async (id: string) => {
    setError(null);
    try {
      await apiDeleteAppointment(id);
      setAppointments((prev) => prev.filter((x) => x.id !== id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to delete appointment");
      throw e;
    }
  };

  // ---- Context value ---------------------------------------------------------
  const value = useMemo<AppointmentsCtx>(
    () => ({
      appointments,
      addAppointment,
      editAppointment,
      deleteAppointment,
      getAvailableSlots,
      initialLoading,
      loading,
      error,
    }),
    [appointments, initialLoading, loading, error]
  );

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// export function useAppointmentsFromProvider() {
//   const ctx = useContext(AppointmentContext);
//   if (!ctx)
//     throw new Error(
//       "useAppointments must be used within an AppointmentProvider"
//     );
//   return ctx;
// }
