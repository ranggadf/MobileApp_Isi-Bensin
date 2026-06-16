import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =========================
// 🔹 MEMBUAT AXIOS INSTANCE
// =========================
const axiosInstance = axios.create({
  baseURL: "https://scrutiny-wisplike-unharmed.ngrok-free.dev/api",

  headers: {
    Accept: "application/json",

    // bypass warning ngrok
    "ngrok-skip-browser-warning": "true",
  },
});

// =========================
// 🔹 INTERCEPTOR REQUEST
// =========================
axiosInstance.interceptors.request.use(
  async (config) => {
    // ambil token login
    const token = await AsyncStorage.getItem("token");

    // tambahkan token jika ada
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default axiosInstance;