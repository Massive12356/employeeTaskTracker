import axios from "axios";



// Create one configured instance for the whole app
const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

export default apiClient;