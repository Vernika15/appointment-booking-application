import React, { useEffect, useMemo, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { doctors } from "../data/doctors";
import type { Appointment } from "../types";

/** Props for AppointmentForm. */
type Props = {
  /** The appointment selected in parent (null when creating). */
  selectedAppointment: Appointment | null;
  /**
   * Optional setter from parent to clear selection after submit/reset.
   * If not provided, the form still works independently.
   */
  setSelectedAppointment?: (a: Appointment | null) => void;
};

/**
 * AppointmentForm component.
 *
 * Renders a controlled form for creating appointments. When `selectedAppointment`
 * is provided (from parent), fields are pre-populated for a better edit-like UX,
 * but actual UPDATE calls should be done in `EditAppointmentForm` (this form
 * only triggers CREATE via context's `addAppointment`).
 */
export const AppointmentForm: React.FC<Props> = ({
  selectedAppointment,
  setSelectedAppointment,
}) => {
  // Context actions/state
  const { addAppointment, getAvailableSlots, loading, error } =
    useAppointments();

  // --- Controlled form state ---
  const [name, setName] = useState<string>("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [slot, setSlot] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Populate fields when parent provides a `selectedAppointment`
   * (e.g., when user clicks "Edit"). When cleared, reset to empty.
   */
  useEffect(() => {
    if (selectedAppointment) {
      setName(selectedAppointment.name);
      setDoctorName(selectedAppointment.doctorName);
      setDoctorId(selectedAppointment.doctorId);
      setDate(selectedAppointment.date);
      setSlot(selectedAppointment.slot);
      setPurpose(selectedAppointment.purpose);
    } else {
      // Reset for create mode
      setName("");
      setDoctorName("");
      setDoctorId(undefined);
      setDate("");
      setSlot("");
      setPurpose("");
    }
  }, [selectedAppointment]);

  /**
   * Base available slots for the current (doctorName, date) pair.
   * - Returns [] until both doctor and date are chosen (UX rule).
   * - Excludes already-booked slots for the same doctor & date.
   */
  const baseSlots = useMemo<string[]>(
    () => (doctorName && date ? getAvailableSlots(doctorName, date) : []),
    [doctorName, date, getAvailableSlots]
  );

  /**
   * Slots to show in the dropdown.
   * - Keeps the currently selected slot (during edit prefill) even if it’s
   *   otherwise filtered out by availability (ensures it remains visible).
   */
  const slotsToShow = useMemo<string[]>(() => {
    let list = baseSlots;
    if (
      selectedAppointment &&
      selectedAppointment.doctorName === doctorName &&
      selectedAppointment.date === date &&
      selectedAppointment.slot &&
      !list.includes(selectedAppointment.slot)
    ) {
      list = [selectedAppointment.slot, ...list];
    }
    return list;
  }, [baseSlots, selectedAppointment, doctorName, date]);

  /**
   * Resets all form fields and clears selected appointment.
   */
  const resetForm = () => {
    setName("");
    setDoctorName("");
    setDoctorId(undefined);
    setDate("");
    setSlot("");
    setPurpose("");
    if (typeof setSelectedAppointment === "function") {
      setSelectedAppointment(null);
    }
  };

  /** Simple required-fields check for button enable + submit guard. */
  const isValid: boolean = Boolean(
    name.trim() &&
      doctorName.trim() &&
      date.trim() &&
      slot.trim() &&
      purpose.trim()
  );

  /**
   * Click handler for the primary CTA.
   * Calls context `addAppointment` (POST /api/appointments) and resets on success.
   *
   * @param e - Button click event
   */
  const handleBookAppointment = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);

    if (!isValid) {
      setSubmitError("Please fill all fields.");
      return;
    }

    try {
      await addAppointment({
        name,
        doctorName,
        doctorId,
        date,
        slot,
        purpose,
      } as Omit<Appointment, "id">);

      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(msg || "Failed to create appointment");
    }
  };

  return (
    <form className="form-container">
      <h3>📝 Appointment Form</h3>

      {/* Patient name */}
      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      {/* Appointment date */}
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      {/* Doctor select:
          - Keeps doctorId + doctorName in sync
          - Resets slot when doctor changes to respect availability rules */}
      <label>
        Doctor:
        <select
          value={doctorId ?? ""}
          onChange={(e) => {
            const id = e.target.value;
            const doc = doctors.find((d) => d.id === id);
            setDoctorId(id || undefined);
            setDoctorName(doc?.name ?? "");
            setSlot(""); // reset previously chosen slot when doctor changes
          }}
          required
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </label>

      {/* Slot select:
          - Disabled list until both doctor & date are chosen (via slotsToShow being [])
          - Shows current slot (when editing) even if otherwise unavailable */}
      <label>
        Slot:
        <select value={slot} onChange={(e) => setSlot(e.target.value)} required>
          <option value="">-- Select Doctor & Date First --</option>
          {slotsToShow.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {/* Purpose / notes */}
      <label>
        Purpose:
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </label>

      {/* Inline error from submit or provider */}
      {(submitError || error) && (
        <p style={{ color: "crimson", marginTop: 8 }}>{submitError || error}</p>
      )}

      <button type="button" onClick={handleBookAppointment}>
        {loading ? "Booking…" : "Book Appointment"}
      </button>
    </form>
  );
};
