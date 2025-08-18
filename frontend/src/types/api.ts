// What backend returns when an appointment is created
export type ApiAppointment = {
  _id?: string;
  id?: string;
  name: string;
  doctorId?: string;
  doctorName: string;
  date: string;
  slot: string;
  purpose: string;
  createdAt?: string;
  updatedAt?: string;
};

// Payload for create
export type CreateAppointmentBody = {
  name: string;
  doctorId?: string;
  doctorName: string;
  date: string;
  slot: string;
  purpose: string;
};

export type UpdateAppointmentBody = {
  name: string;
  doctorId?: string;
  doctorName: string;
  date: string;
  slot: string;
  purpose: string;
};
