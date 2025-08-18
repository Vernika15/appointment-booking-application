import type { Doctor } from "../types";

/**
 * A constant array of all possible time slots available for appointments.
 */
export const ALL_SLOTS: string[] = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

/**
 * Array of doctor objects representing available doctors in the system.
 * Each doctor has an ID, name, and a list of available time slots.
 */
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. A.P.J. Abdul",
  },
  {
    id: "2",
    name: "Dr. Maya Rao",
  },
  {
    id: "3",
    name: "Dr. Vikram Patel",
  },
  {
    id: "4",
    name: "Dr. In Ho",
  },
  {
    id: "5",
    name: "Dr. Deepak Verma",
  },
  {
    id: "6",
    name: "Dr. Prem Chand",
  },
];
