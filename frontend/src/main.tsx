import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppointmentProvider } from "./context/AppointmentProvider.tsx";

/**
 * The root of the React application.
 *
 * - Wraps the App in React's `StrictMode` for highlighting potential problems.
 * - Provides global appointment context using `AppointmentProvider`.
 * - Renders the app into the HTML element with id 'root'.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppointmentProvider>
      <App />
    </AppointmentProvider>
  </StrictMode>
);
