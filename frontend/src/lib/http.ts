import axios, { AxiosError, type AxiosInstance } from "axios";

/** Shape of common backend error payloads we expect. */
type BackendErrorPayload = {
  message?: string;
  error?: string;
  // Allow additional fields without narrowing
  [key: string]: unknown;
};

/** Resolve and normalize the base URL once at module load. */
const rawBaseUrl = (import.meta.env.VITE_API_URL as string) ?? "/api";
const baseURL: string = rawBaseUrl.replace(/\/$/, ""); // remove trailing slash

/** Preconfigured Axios client for the app. */
export const http: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Global response error handler:
 * - Pull `message` or `error` from server response if present
 * - Fall back to Axios error message
 */
http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<BackendErrorPayload>) => {
    const data = err.response?.data;
    const message =
      (data && (data.message || data.error)) ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
