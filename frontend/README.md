# 🗓️ Appointment Booking System

This is a single-page **Appointment Booking System** built using **React, TypeScript, and Vite**. It allows users to select doctors, choose available time slots, book appointments, and manage them with full **CRUD (Create, Read, Update, Delete)** functionality — all backed by `localStorage`.

Live Demo: [appointment-booking-system](https://appointment-booking-system-react-six.vercel.app)

---

## 🚀 Features

- 🧍 Book appointments with patient name, doctor, date, time slot, and purpose
- 📆 Slot availability updates dynamically based on selected doctor and date
- 🗃 View all appointments in a clean tabular format
- ✏️ Edit appointment via a modal with pre-filled data
- 🗑️ Delete appointment with confirmation and automatic slot re-availability
- 💾 All data is persisted in the browser using `localStorage`
- 🔄 Live UI updates using global state-driven rendering
- 🧭 Horizontal split layout: form on the left, appointment list on the right
- 🎉 Alerts shown on successful deletion

---

## 🛠️ Getting Started

To run the project locally:

### 1. Clone the repo

```bash
git clone https://github.com/your-username/appointment-booking-system-react.git
cd appointment-booking-system-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Then visit: [http://localhost:5173](http://localhost:5173)

> Make sure you have **Node.js 18+** installed for Vite compatibility.

---

## 📁 Project Structure

The app uses a **modular, state-driven architecture** inspired by React — built purely in TypeScript with Vite:

```
📦 project-root/
├── index.html                            # HTML shell
├── src/
│   ├── components/
│   │   ├── AppointmentForm.tsx           # New + edit form with modal support
│   │   ├── AppointmentsTable.tsx         # Appointment listing with Edit/Delete
│   │   ├── EditAppointmentForm.tsx       # Edit appointment form
│   │   └── TotalAppointmentsCard.tsx     # Total appointments card at top
│   ├── context/
│   │   ├── AppointmentContext.tsx        # React Context object for appointments
│   │   └── AppointmentProvider.tsx       # Context provider managing state + CRUD logic
│   ├── data/
│   │   └── doctors.ts                    # List of doctors with names and IDs
│   ├── hooks/
│   │   └── useAppointments.ts            # Custom hook to access appointment context
│   ├── utils/
│   │   ├── id.ts                         # Unique ID generator for appointments
│   │   └── localStorage.ts               # localStorage interaction
│   ├── App.css                           # Global styles
│   ├── App.tsx                           # Root layout (form + table + modal)
│   ├── main.tsx                          # App entry point
│   └── types.ts                          # Global types
├── README.md                             # You're here!
└── tsconfig.json                         # typescript configuration
```

## 🙋‍♀️ Author

**Vernika Garg**  
Front-end Developer | React Native Enthusiast

---

## 📃 License

This project is part of an academic assignment and intended for educational purposes only.
