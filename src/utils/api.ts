import axios from "axios";

const api = (no_auth = false) => {
  const token = localStorage.getItem("token") || "";
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
  }
  if (no_auth) {
    delete axios.defaults.headers.common["Authorization"];
  }
  return axios;
};

export default api;
