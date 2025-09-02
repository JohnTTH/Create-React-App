import axios from "axios";
import { API_BASE } from "../../config";

//=========================================================email=============================================================
//Send OTP to Email
export const loginWithEmail = async (dataEmail) => {
  const res = await axios.post(`${API_BASE}/login-email`, dataEmail);
  return res.data; 
};

//Validate OTP from Email
export const validateAccessCodeEmail = async (data) => {
  const res = await axios.post(`${API_BASE}/validate-access-code`, data);
  return res.data;
};

//Login session OTP success
export const loginSessionEmail = async ({ email, token }) => {
  const res = await axios.post(`${API_BASE}/login-session`, { email, token });
  return res.data;
};

//===============================================Phone=======================================================================
//send OTP for Phone
export const loginWithPhone = async (dataPhone) => {
  const res = await axios.post(`${API_BASE}/login-phone`, dataPhone);
  return res.data;
}

// Validate OTP from Phone
export const validateAccessCodePhone = async (data) => {
  const res = await axios.post(`${API_BASE}/validate-access-code-phone`, data);
  return res.data;
};

// Login session OTP success
export const loginSessionPhone = async ({ phone, token }) => {
  const res = await axios.post(`${API_BASE}/login-session-phone`, { phone, token });
  return res.data;
};