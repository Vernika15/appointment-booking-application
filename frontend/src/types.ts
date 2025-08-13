/**
 * Represents a doctor with available time slots.
 */
export type Doctor = {
  /** Unique identifier for the doctor */
  id: string;

  /** Full name of the doctor */
  name: string;

  /** Time slots that the doctor is available for appointments */
  availableSlots: string[];
};

/**
 * Represents a booked appointment.
 */
export type Appointment = {
  /** Unique identifier for the appointment */
  id: string;

  /** Patient's name */
  name: string;

  /** ID of the selected doctor */
  doctorId: string;

  /** Name of the selected doctor (for display) */
  doctorName: string;

  /** Appointment date (in YYYY-MM-DD format) */
  date: string;

  /** Selected time slot */
  slot: string;

  /** Reason for the appointment */
  purpose: string;
};

/**
 * Context shape for managing appointments globally.
 */
export type AppointmentContextType = {
  /** List of all booked appointments */
  appointments: Appointment[];

  /** Currently selected appointment (used for editing) */
  selectedAppointment: Appointment | null;

  /**
   * Adds a new appointment.
   * @param appointment - Appointment to add
   */
  addAppointment: (appointment: Appointment) => void;

  /**
   * Updates an existing appointment.
   * @param appointment - Updated appointment details
   */
  updateAppointment: (appointment: Appointment) => void;

  /**
   * Deletes an appointment by ID.
   * @param id - ID of the appointment to delete
   */
  deleteAppointment: (id: string) => void;

  /**
   * Sets or clears the selected appointment for editing.
   * @param appointment - The appointment to select or null to clear
   */
  setSelectedAppointment: (appointment: Appointment | null) => void;

  /**
   * Returns available time slots for a doctor on a specific date.
   * @param doctorId - ID of the doctor
   * @param date - Date to check (in YYYY-MM-DD format)
   * @returns Array of available time slots
   */
  getAvailableSlots: (doctorId: string, date: string) => string[];
};
