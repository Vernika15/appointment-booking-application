import React, { useEffect, useMemo, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { doctors } from "../data/doctors";
import type { Appointment } from "../types";

/**
 * Find a doctor object by a case-insensitive name match.
 *
 * @param name - Doctor name to search for
 * @returns The matching doctor from the static list, or undefined if not found
 */
function findDoctorByName(name: string | undefined) {
  if (!name) return undefined;
  const n = name.trim().toLowerCase();
  return doctors.find((d) => d.name.trim().toLowerCase() === n);
}

/**
 * Props for the EditAppointmentForm component
 */
type Props = {
  /** Appointment object to prefill the form */
  appointment: Appointment;
  /** Function to close the modal after editing */
  onClose: () => void;
};

/**
 * EditAppointmentForm component is rendered inside a modal to edit an existing appointment.
 * It pre-fills all form fields based on the passed appointment and allows updating them.
 *
 * @param {Props} props - Contains the appointment to edit and the onClose function
 * @returns JSX.Element
 */
export const EditAppointmentForm: React.FC<Props> = ({
  appointment,
  onClose,
}) => {
  const { editAppointment, getAvailableSlots, loading, error } =
    useAppointments();

  const [name, setName] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [slot, setSlot] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Prefill the form fields when `appointment` changes (e.g., user opens a different row).
   * If doctorId is missing on the record, derive it from the doctorName so the <select> reflects the current doctor.
   */
  useEffect(() => {
    if (appointment) {
      setName(appointment.name);
      setDoctorName(appointment.doctorName);
      setDate(appointment.date);
      setSlot(appointment.slot);
      setPurpose(appointment.purpose);

      if (appointment.doctorId) {
        setDoctorId(appointment.doctorId);
      } else {
        const match = findDoctorByName(appointment.doctorName);
        setDoctorId(match?.id);
      }
    }
  }, [appointment]);

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
   * - Keeps the currently selected slot visible (when editing) even if otherwise filtered out.
   */
  const slotsToShow = useMemo<string[]>(() => {
    let list = baseSlots;
    if (
      appointment.doctorName === doctorName &&
      appointment.date === date &&
      appointment.slot &&
      !list.includes(appointment.slot)
    ) {
      list = [appointment.slot, ...list];
    }
    return list;
  }, [baseSlots, appointment, doctorName, date]);

  /** Simple required-fields check for enabling the submit and guarding submit handler. */
  const isValid: boolean = Boolean(
    name.trim() &&
      doctorName.trim() &&
      date.trim() &&
      slot.trim() &&
      purpose.trim()
  );

  /**
   * Submit handler that calls the PUT endpoint via context's `editAppointment`.
   *
   * @param e - Button click event
   */
  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isValid) {
      setSubmitError("Please fill all fields.");
      return;
    }

    try {
      await editAppointment(appointment.id, {
        name,
        doctorName,
        doctorId,
        date,
        slot,
        purpose,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(msg || "Failed to update appointment");
    }
  };

  return (
    <form className="form-container">
      <h3>✏️ Edit Appointment</h3>

      {/* Name */}
      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      {/* Date (reset slot on change to respect availability rules) */}
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSlot(""); // previously chosen slot may no longer be available
          }}
          required
        />
      </label>

      {/* Doctor select: keep doctorId and doctorName in sync; reset slot on change */}
      <label>
        Doctor:
        <select
          value={doctorId ?? ""}
          onChange={(e) => {
            const id = e.target.value || undefined;
            setDoctorId(id);
            const doc = doctors.find((d) => d.id === id);
            setDoctorName(doc?.name ?? "");
            setSlot(""); // reset slot when doctor changes
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

      {/* Slot (only after doctor & date; preserves current slot visibility) */}
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

      <button type="button" onClick={handleUpdate}>
        {loading ? "Updating…" : "Update Appointment"}
      </button>
    </form>
  );
};
