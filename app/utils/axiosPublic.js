import axios from "axios";

export const axiosPublic = axios.create({
  // baseURL: 'http://localhost:5000',
  baseURL: "https://fc-backend-664306765395.asia-south1.run.app",
});
