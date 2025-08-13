import React from "react";
import { useAppointments } from "../hooks/useAppointments";
import type { Appointment } from "../types";

/**
 * Props for the AppointmentsTable component
 */
type Props = {
  /**
   * Function to be called when an appointment is selected for editing.
   * @param appointment - The appointment object to edit
   */
  onEdit: (appointment: Appointment) => void;
};

/**
 * AppointmentsTable component displays a list of booked appointments in a table format.
 * It allows users to delete appointments or trigger the edit modal via the `onEdit` callback.
 *
 * @param {Props} props - Contains the onEdit handler for editing appointments
 * @returns JSX.Element
 */
export const AppointmentsTable: React.FC<Props> = ({ onEdit }) => {
  const { appointments, deleteAppointment } = useAppointments();

  return (
    <div className="table-container">
      <h3>📅 Appointments Table</h3>

      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Slot</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.name}</td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.date}</td>
                  <td>{appt.slot}</td>
                  <td>{appt.purpose}</td>
                  <td>
                    {/* Edit Button: triggers the onEdit handler */}
                    <button className="edit-btn" onClick={() => onEdit(appt)}>
                      Edit
                    </button>

                    {/* Delete Button: confirms deletion and removes the appointment */}
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this appointment?"
                          )
                        ) {
                          deleteAppointment(appt.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
