/**
 * services/appointments.ts
 * ------------------------
 * Service layer for Appointment API.
 * Wraps HTTP calls and maps API models to UI models.
 *
 * Endpoints:
 * - GET    /api/appointments
 * - POST   /api/appointments
 * - PUT    /api/appointments/:id
 * - DELETE /api/appointments/:id
 */

import { http } from "../lib/http";
import type { Appointment } from "../types";
import type {
  ApiAppointment,
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "../types/api";
import { toAppointment } from "../utils/mappers";

/**
 * HTTP: GET /api/appointments
 * Fetch all appointments from the server.
 *
 * @returns Promise resolving to an array of UI `Appointment` objects.
 * @throws Error when the request fails (normalized by the Axios interceptor).
 */
export async function fetchAppointments(): Promise<Appointment[]> {
  const { data } = await http.get<ApiAppointment[]>("/appointments");
  return data.map(toAppointment);
}

/**
 * HTTP: POST /api/appointments
 * Create a new appointment.
 *
 * @param body - Payload matching backend contract.
 * @returns Promise resolving to the created UI `Appointment`.
 * @throws Error when the request fails (normalized by the Axios interceptor).
 */
export async function createAppointment(
  body: CreateAppointmentBody
): Promise<Appointment> {
  const { data } = await http.post<ApiAppointment>("/appointments", body);
  return toAppointment(data);
}

/**
 * HTTP: PUT /api/appointments/:id
 * Update an existing appointment by id.
 *
 * @param id - Appointment id to update.
 * @param body - Complete payload expected by the backend (merged in provider).
 * @returns Promise resolving to the updated UI `Appointment`.
 * @throws Error when the request fails (normalized by the Axios interceptor).
 */
export async function updateAppointmentById(
  id: string,
  body: UpdateAppointmentBody
): Promise<Appointment> {
  const { data } = await http.put<ApiAppointment>(`/appointments/${id}`, body);
  return toAppointment(data);
}

/**
 * HTTP: DELETE /api/appointments/:id
 * Delete an appointment by id.
 *
 * @param id - Appointment id to delete.
 * @returns Promise resolving to void on successful deletion.
 * @throws Error when the request fails (normalized by the Axios interceptor).
 */
export async function deleteAppointmentById(id: string): Promise<void> {
  await http.delete(`/appointments/${id}`);
}
