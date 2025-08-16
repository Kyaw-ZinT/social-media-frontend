import axios from "axios";

const API_BASE_URL = "https://social-media-backend-ibrq.onrender.com"; // Your backend server port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
