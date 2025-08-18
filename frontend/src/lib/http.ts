import axios, { AxiosError } from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, "") || "/api";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    const message =
      (err.response?.data &&
        (err.response.data.message || err.response.data.error)) ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
