import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
export const errorText = (e) =>
  e.response?.data?.message ||
  "Cannot connect to API. Check that backend and MongoDB are running.";
export default api;
