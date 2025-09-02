import axios from "axios";
import { API_BASE } from "../../config.js";

const jwt = localStorage.getItem("jwt");

export const getEmployees = async () => {
  const res = await axios.get(`${API_BASE}/GetEmployee/Employee`);
  return res.data.employees;
};

export const getAdmin = async () => {
  const res = await axios.get(`${API_BASE}/GetEmployee/admin`, {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  return res.data.employees;
};

export const getMessagesByRoom = async (room) => {
  const res = await axios.get(`${API_BASE}/GetMessages/${room}`);
  return res.data;
};

