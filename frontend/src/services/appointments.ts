import { http } from "../lib/http";
import type { Appointment } from "../types";
import type {
  ApiAppointment,
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "../types/api";
import { toAppointment } from "../utils/mappers";

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data } = await http.get<ApiAppointment[]>("/appointments");
  return data.map(toAppointment);
}

export async function createAppointment(
  body: CreateAppointmentBody
): Promise<Appointment> {
  const { data } = await http.post<ApiAppointment>("/appointments", body);
  return toAppointment(data);
}

export async function updateAppointmentById(
  id: string,
  body: UpdateAppointmentBody
): Promise<Appointment> {
  const { data } = await http.put<ApiAppointment>(`/appointments/${id}`, body);
  return toAppointment(data);
}

export async function deleteAppointmentById(id: string): Promise<void> {
  await http.delete(`/appointments/${id}`);
}
