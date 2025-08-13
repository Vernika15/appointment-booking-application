import type { Appointment } from "../types";

const STORAGE_KEY = "appointments";

/**
 * Loads appointments from localStorage.
 *
 * @returns {Appointment[]} An array of stored appointments. Returns an empty array if none are found.
 *
 * @example
 * const storedAppointments = loadAppointments();
 */
export const loadAppointments = (): Appointment[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

/**
 * Saves an array of appointments to localStorage.
 *
 * @param {Appointment[]} appointments - The appointments to save.
 *
 * @example
 * saveAppointments([{ id: "_abc123", name: "John", ... }]);
 */
export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};
