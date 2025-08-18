/**
 * types/api.ts
 * ------------
 * Backend (API) data contracts for appointments.
 * - `ApiAppointment` mirrors what the server returns.
 * - `CreateAppointmentBody` / `UpdateAppointmentBody` are request payloads.
 *
 * Notes:
 * - `id` vs `_id`: support both plain and Mongo-style ids; the mapper will normalize.
 * - `date` should be ISO-like "YYYY-MM-DD".
 * - `slot` is a human-readable label, e.g., "09:00 AM".
 */

/** Raw appointment shape returned by the backend. */
export type ApiAppointment = {
  /** Mongo-style identifier (if the backend uses Mongo). */
  _id?: string;

  /** Plain identifier (some backends return `id` instead of `_id`). */
  id?: string;

  /** Patient name. */
  name: string;

  /** Optional doctor identifier (if your domain tracks doctor ids). */
  doctorId?: string;

  /** Human-readable doctor name (used by slot availability). */
  doctorName: string;

  /** Appointment date in "YYYY-MM-DD" format. */
  date: string;

  /** Selected time slot label, e.g., "09:00 AM". */
  slot: string;

  /** Brief purpose/notes for the visit. */
  purpose: string;

  /** Server timestamp: creation time (optional). */
  createdAt?: string;

  /** Server timestamp: last update time (optional). */
  updatedAt?: string;
};

/** Payload to create a new appointment (POST /api/appointments). */
export type CreateAppointmentBody = {
  /** Patient name. */
  name: string;

  /** Optional doctor identifier (if available from UI). */
  doctorId?: string;

  /** Human-readable doctor name. */
  doctorName: string;

  /** Appointment date in "YYYY-MM-DD". */
  date: string;

  /** Time slot label, e.g., "09:00 AM". */
  slot: string;

  /** Purpose/notes. */
  purpose: string;
};

/** Payload to update an existing appointment (PUT /api/appointments/:id). */
export type UpdateAppointmentBody = {
  /** Patient name. */
  name: string;

  /** Optional doctor identifier. */
  doctorId?: string;

  /** Human-readable doctor name. */
  doctorName: string;

  /** Appointment date in "YYYY-MM-DD". */
  date: string;

  /** Time slot label, e.g., "02:00 PM". */
  slot: string;

  /** Purpose/notes. */
  purpose: string;
};
