import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/AxiosInstance"; 
// axios instance (sudah include baseURL + token otomatis)


// =========================
// 🔹 CREATE CONTEXT ORDER
// =========================
const OrderContext = createContext();


// =========================
// 🔹 PROVIDER ORDER (GLOBAL STATE)
// =========================
export const OrderProvider = ({ children }) => {

  // state untuk menyimpan semua order
  const [orders, setOrders] = useState([]);


  // =========================
  // 🔹 AMBIL DATA ORDER DARI BACKEND
  // =========================
  const loadOrders = async () => {
    try {
      // request ke API Laravel
      const res = await api.get("/orders");

      // simpan hasil response ke state
      setOrders(res.data || []);
    } catch (err) {
      console.log("LOAD ORDER ERROR:", err);
    }
  };


  // =========================
  // 🔹 AUTO LOAD SAAT APP DIBUKA
  // =========================
  useEffect(() => {
    loadOrders();
  }, []);


  // =========================
  // 🔹 PROVIDE DATA KE SEMUA COMPONENT
  // =========================
  return (
    <OrderContext.Provider value={{ orders, loadOrders }}>
      {children}
    </OrderContext.Provider>
  );
};


// =========================
// 🔹 CUSTOM HOOK (biar lebih gampang dipakai)
// =========================
export const useOrders = () => useContext(OrderContext);