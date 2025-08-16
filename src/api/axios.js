import axios from "axios";

const API_BASE_URL = "http://localhost:5003/api"; // Your backend server port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
