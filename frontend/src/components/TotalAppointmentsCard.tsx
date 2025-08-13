import React from "react";

/**
 * Props for the TotalAppointmentsCard component
 */
interface Props {
  /** Total number of booked appointments to display */
  totalAppointments: number;
}

/**
 * Displays the total number of appointments in a styled card.
 *
 * @component
 * @param {Props} props - Component props
 * @param {number} props.totalAppointments - Total appointments count
 * @returns {JSX.Element} A styled card showing the total count
 */
const TotalAppointmentsCard: React.FC<Props> = ({ totalAppointments }) => {
  return (
    <div className="top-card">
      <span>Total Appointments: {totalAppointments}</span>
    </div>
  );
};

export default TotalAppointmentsCard;
