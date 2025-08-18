import React, { useEffect, useMemo, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { doctors } from "../data/doctors";
import type { Appointment } from "../types";

type Props = {
  selectedAppointment: Appointment | null;
  setSelectedAppointment?: (a: Appointment | null) => void;
};

/**
 * AppointmentForm component allows users to book a new appointment
 * or update an existing one. It provides dynamic doctor availability
 * and form validation.
 */
export const AppointmentForm: React.FC<Props> = ({
  selectedAppointment,
  setSelectedAppointment,
}) => {
  const { addAppointment, getAvailableSlots, loading, error } =
    useAppointments();

  // Form state variables
  const [name, setName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [slot, setSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * useEffect to update available slots when doctor or date changes.
   * Also includes selected slot if editing an appointment.
   */
  // useEffect(() => {
  //   if (doctorId && date) {
  //     const slots = getAvailableSlots(doctorId, date);

  //     // When editing, re-add the current slot to the list
  //     if (
  //       selectedAppointment?.slot &&
  //       selectedAppointment.doctorId === doctorId &&
  //       selectedAppointment.date === date
  //     ) {
  //       slots.push(selectedAppointment.slot);
  //       slots.sort();
  //     }

  //     setAvailableSlots(slots);
  //   } else {
  //     setAvailableSlots([]);
  //   }
  // }, [doctorId, date, selectedAppointment]);

  /**
   * useEffect to populate form fields when an appointment is selected for editing.
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
      setName("");
      setDoctorName("");
      setDoctorId(undefined);
      setDate("");
      setSlot("");
      setPurpose("");
    }
  }, [selectedAppointment]);

  const baseSlots = useMemo(
    () => (doctorName && date ? getAvailableSlots(doctorName, date) : []),
    [doctorName, date, getAvailableSlots]
  );

  const slotsToShow = useMemo(() => {
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

  const isValid =
    name.trim() &&
    doctorName.trim() &&
    date.trim() &&
    slot.trim() &&
    purpose.trim();

  // --- CREATE via API on button click ---
  const handleBookAppointment = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
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

  /**
   * Handles form submission for both creating and updating an appointment.
   *
   * @param e - React form event
   */
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const doctor = doctors.find((d) => d.id === doctorId);
  //   if (!doctor) return;

  //   const appointment = {
  //     id: selectedAppointment ? selectedAppointment.id : generateId(),
  //     name,
  //     date,
  //     doctorId,
  //     doctorName: doctor.name,
  //     slot,
  //     purpose,
  //   };

  //   if (selectedAppointment) {
  //     updateAppointment(appointment);
  //   } else {
  //     addAppointment(appointment);
  //   }

  //   resetForm();
  // };

  return (
    <form className="form-container">
      <h3>📝 Appointment Form</h3>

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
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Doctor:
        <select
          // value={doctorId}
          value={doctorId ?? ""}
          // onChange={(e) => setDoctorId(e.target.value)}
          onChange={(e) => {
            const id = e.target.value;
            const doc = doctors.find((d) => d.id === id);
            setDoctorId(id || undefined);
            setDoctorName(doc?.name ?? "");
            setSlot(""); // reset slot when doctor changes (preserves your UX)
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
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          required
          // disabled={!doctorId || !date}
        >
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

      <button
        type="button"
        onClick={handleBookAppointment}
        // disabled={loading || !isValid}
      >
        {/* {selectedAppointment ? "Update Appointment" : "Book Appointment"} */}
        {loading ? "Booking…" : "Book Appointment"}
      </button>
    </form>
  );
};
