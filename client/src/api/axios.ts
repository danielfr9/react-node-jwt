import axios from "axios";

// if (!import.meta.env.BACKEND_URL)
//   throw Error("Missing value for the `BACKEND_URL` environment variable");

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:4000";

export default axios.create({
  baseURL: BACKEND_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
