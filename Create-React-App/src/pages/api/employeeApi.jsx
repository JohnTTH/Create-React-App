import axios from "axios";
import { API_BASE } from "../../config";

export const getEmployees = async () => {
  const res = await axios.get(`${API_BASE}/GetEmployee/Employee`);
  return res.data.employees;
};

export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${API_BASE}/DeleteEmployee/${id}`);
  return res.data;
};

export const createEmployee = async (employeeData) => {
  const res = await axios.post(`${API_BASE}/CreateEmployee`, employeeData);
  return res.data;
};