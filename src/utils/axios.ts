import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// axiosInstance.defaults.headers.post["Content-Type"] = undefined;

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["ngrok-skip-browser-warning"] = "true";

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // 🔥 only clear if token exists (avoid logout loop)
    if (status === 401 && token) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");

      // OPTIONAL: redirect here OR let ProtectedRoute handle it
      // window.location.replace("/signin");
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
