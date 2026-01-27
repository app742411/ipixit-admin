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
    const isAuthPage = window.location.pathname.includes("/signin");

    if (status === 401 && !isAuthPage) {
      // clear auth data
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");

      // // redirect to signin
      // window.location.href = "/signin";
      if (window.location.pathname !== "/signin") {
        window.location.replace("/signin");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
