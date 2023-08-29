import axios from "axios";
import jwtDecode from "jwt-decode";

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else delete axios.defaults.headers.common["Authorization"];
};

export const isTokenValid = (token) => {
  if (!token) return false;
  const { exp } = jwtDecode(token);
  const current_time = new Date().getTime() / 1000;
  return exp > current_time;
};

export const parseUser = (token) => {
  if (!token) return null;
  const { customer_name, user_email, user_role, username } = jwtDecode(token);
  return { customer_name, user_email, user_role, username };
};
