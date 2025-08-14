# 📡 Appointment Booking API (Express + TypeScript + MongoDB)

This is a backend **REST API service** for managing appointment bookings, built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**. It supports full **CRUD** operations to create, fetch, update, and delete appointments, along with server-side validation and error handling.

---

## 🚀 Features

- 📥 Create new appointments with required fields
- 📤 Fetch all appointments from MongoDB
- ✏️ Update existing appointment details
- 🗑️ Delete appointments by ID
- ❌ Error handling for invalid routes or input
- 💾 MongoDB integration using `mongoose`
- 🔄 Live reload during development with `ts-node-dev`

---

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **ts-node-dev**
- **dotenv**
- **express-validator**

---

## 🛠️ Getting Started

To run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/Vernika15/appointment-booking-backend.git
cd appointment-booking-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory and add:

```bash
PORT=8081
MONGO_URI=mongodb+srv://<username>:<encoded-password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

> Make sure the password is URL encoded, and the user has read/write permissions.

### 3. Run the development server

```bash
npm run dev
```

Then visit: [http://localhost:8081](http://localhost:8081)

---

## 📁 Project Structure

```
📦 project-root/
├── src/
│   ├── config/
│   │   └── db.ts                           # MongoDB connection setup
│   ├── controllers/
│   │   └── appointmentController.ts        # Route logic handlers
│   ├── models/
│   │   └── appointmentModel.ts             # Mongoose schema definitions
│   ├── routes/
│   │   └── appointmentRoutes.ts            # API route definitions
│   └── index.ts                            # Entry point
├── .env                                    # Environment variables
├── README.md                               # You're here!
└── tsconfig.json                           # typescript configuration
```

## 🙋‍♀️ Author

**Vernika Garg**  
Front-end Developer | React Native Enthusiast | Backend Developer | TypeScript & Express Enthusiast

---

## 📃 License

This project is part of an academic assignment and intended for educational purposes only.
