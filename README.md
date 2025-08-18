# Appointment Booking Application

A full-stack appointment booking app with a React + TypeScript frontend and a REST API for appointments (create, list, update, delete). This application wires the UI to live endpoints and adds a proxy-friendly setup to avoid CORS during development and deployment.

---

## Features

- Create / View / Update / Delete appointments
- Slot availability per **doctor + date** (unavailable slots hidden)
- Clean React Context for global state (`AppointmentContext` + `AppointmentProvider`)
- Axios client with unified error handling
- Works with **Nginx proxy** (`/api` → backend) or direct API URL

---

## Monorepo Layout

```
.
├─ frontend/           # React + TypeScript (Vite)
├─ backend/            # REST API (appointments CRUD)
├─ nginx/              # Reverse proxy config (optional; used in Docker)
└─ docker-compose.yml  # Orchestrates nginx, frontend (static), and backend
```

> If you’re running only the frontend + backend without Docker, you can ignore the `nginx/` folder.

---

## Prerequisites

- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

---

## Environment Variables

### Frontend (`frontend/.env`)

**Pick ONE** style:

```env
# A) Recommended during dev: use proxy (Vite or Nginx)
VITE_API_URL=/api

# B) Direct to the API (then backend must enable CORS):
# VITE_API_URL=http://localhost:8081/api
```

> The app trims any trailing `/` automatically.

### Backend

Typical (adjust to your backend stack):

```env
PORT=8081
# CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
# DB_...=...
```

---

## Running Locally

### Option 1 — Vite Dev Server (no Docker)

**Backend**

```bash
cd backend
npm install
# scripts may vary; common examples:
# npm run dev      # start with nodemon / ts-node
# npm start        # start compiled JS
# npm run build    # compile TS → JS (if applicable)
```

**Frontend**

```bash
cd ../frontend
npm install

# Use proxy style during dev:
#   VITE_API_URL=/api in frontend/.env.development

# If you use Vite’s dev proxy (recommended), add this to vite.config.ts:
#   server: { proxy: { '/api': { target: 'http://localhost:8081', changeOrigin: true } } }

npm run dev    # opens http://localhost:5173
```

Now the browser calls **/api/appointments** at **5173**, Vite forwards to **http://localhost:8081**.

> If you prefer direct API URL (no proxy), set `VITE_API_URL=http://localhost:8081/api` and enable CORS on the backend for your frontend origin.

---

### Option 2 — Docker Compose (Nginx proxy)

From the repo root:

```bash
docker-compose up --build
```

- Nginx serves the frontend and proxies `/api/*` to the backend.
- Open the printed port, commonly **http://localhost:8080**.

If you modify any ports or service names in `docker-compose.yml`, update Nginx accordingly (see below).

---

## API Endpoints

**Base URL**

- Proxy mode: `http://localhost:8080/api` (or Vite dev server + proxy at `http://localhost:5173/api`)
- Direct: `http://localhost:8081/api`

### GET /api/appointments

Returns the list of appointments.

### POST /api/appointments

Creates a new appointment.

**Body**

```json
{
  "name": "Prakash",
  "doctorId": "2",
  "doctorName": "Dr. Maya Rao",
  "date": "2025-08-18",
  "slot": "09:00 AM",
  "purpose": "fever"
}
```

### PUT /api/appointments/:id

Updates an appointment.

### DELETE /api/appointments/:id

Deletes an appointment.

---

## Frontend Code Map

- `src/context/AppointmentContext.ts` — Context type + instance
- `src/context/AppointmentProvider.tsx` — Fetches list and exposes CRUD
- `src/services/appointments.ts` — API calls (GET/POST/PUT/DELETE)
- `src/lib/http.ts` — Axios instance + error normalization
- `src/components/AppointmentForm.tsx` — Create
- `src/components/EditAppointmentForm.tsx` — Update (modal)
- `src/components/AppointmentsTable.tsx` — List + Edit/Delete buttons
- `src/data/doctors.ts` — doctor list + `ALL_SLOTS`

---

## 🙋‍♀️ Author

**Vernika Garg**

---

## 📃 License

This project is part of an academic assignment and intended for educational purposes only.
