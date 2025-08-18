import React, { useEffect, useMemo, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { doctors } from "../data/doctors";
import type { Appointment } from "../types";

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

  const [name, setName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [slot, setSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Prefill the form fields when a new appointment is passed in
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

  const baseSlots = useMemo(
    () => (doctorName && date ? getAvailableSlots(doctorName, date) : []),
    [doctorName, date, getAvailableSlots]
  );

  const slotsToShow = useMemo(() => {
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

  const isValid =
    name.trim() &&
    doctorName.trim() &&
    date.trim() &&
    slot.trim() &&
    purpose.trim();

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

      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSlot("");
          }}
          required
        />
      </label>

      <label>
        Doctor:
        <select
          value={doctorId ?? ""}
          onChange={(e) => {
            const id = e.target.value || undefined;
            setDoctorId(id);
            const doc = doctors.find((d) => d.id === id);
            setDoctorName(doc?.name ?? "");
            setSlot("");
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

      <label>
        Purpose:
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </label>

      {(submitError || error) && (
        <p style={{ color: "crimson", marginTop: 8 }}>{submitError || error}</p>
      )}

      <button type="button" onClick={handleUpdate}>
        {loading ? "Updating…" : "Update Appointment"}
      </button>
    </form>
  );
};
