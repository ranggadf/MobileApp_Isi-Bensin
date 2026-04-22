import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =========================
// 🔹 MEMBUAT AXIOS INSTANCE
// =========================
const axiosInstance = axios.create({
  // baseURL = alamat API backend Laravel
  // semua request akan otomatis diarahkan ke sini
  baseURL: "http://192.168.1.8:8000/api",
});

// =========================
// 🔹 INTERCEPTOR REQUEST
// =========================
// interceptor = middleware yang jalan SEBELUM request dikirim
axiosInstance.interceptors.request.use(
  async (config) => {

    // ambil token dari AsyncStorage (local storage mobile)
    const token = await AsyncStorage.getItem("token");

    // jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // lanjutkan request yang sudah dimodifikasi
    return config;
  },

  // jika terjadi error saat request setup
  (error) => Promise.reject(error)
);

export default axiosInstance;