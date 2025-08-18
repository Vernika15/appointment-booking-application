import type { ApiAppointment } from "../types/api";
import type { Appointment } from "../types";

export function toAppointment(a: ApiAppointment): Appointment {
  const id = a._id || a.id || "";
  return {
    id,
    name: a.name,
    doctorName: a.doctorName,
    date: a.date,
    slot: a.slot,
    purpose: a.purpose,
    doctorId: a.doctorId,
  };
}
