import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/AxiosInstance"; 
// axios instance (sudah otomatis pakai token + baseURL)


// =========================
// 🔹 MEMBUAT CONTEXT CART
// =========================
const CartContext = createContext();


// =========================
// 🔹 PROVIDER (PEMBUNGKUS APP)
// =========================
export const CartProvider = ({ children }) => {

  // state untuk menyimpan isi cart
  const [cartItems, setCartItems] = useState([]);


  // =========================
  // 🔹 AMBIL DATA CART DARI BACKEND
  // =========================
  const loadCart = async () => {
    try {
      // request ke backend Laravel
      const res = await api.get("/cart");

      // ambil data items dari response
      setCartItems(res.data.items || []);
    } catch (err) {
      console.log("LOAD CART ERROR:", err);
    }
  };


  // =========================
  // 🔹 TAMBAH ITEM KE CART
  // =========================
  const addToCart = async (data) => {
    try {
      // kirim data item ke backend
      await api.post("/cart", data);

      // setelah tambah → sync ulang cart dari backend
      await loadCart();
    } catch (err) {
      console.log("ADD CART ERROR:", err);
    }
  };


  // =========================
  // 🔹 HAPUS ITEM DARI CART
  // =========================
  const removeFromCart = async (id) => {
    try {
      // hapus item berdasarkan id
      await api.delete(`/cart/${id}`);

      // sync ulang data cart
      await loadCart();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };


  // =========================
  // 🔹 KOSONGKAN CART
  // =========================
  const clearCart = async () => {
    try {
      // request hapus semua item cart
      await api.delete("/cart-clear");

      // langsung kosongkan state lokal
      setCartItems([]);
    } catch (err) {
      console.log("CLEAR ERROR:", err);
    }
  };


  // =========================
  // 🔹 AUTO LOAD SAAT APP START
  // =========================
  useEffect(() => {
    loadCart();
  }, []);


  // =========================
  // 🔹 PROVIDE DATA KE SELURUH APP
  // =========================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// =========================
// 🔹 CUSTOM HOOK (biar gampang dipakai)
// =========================
export const useCart = () => useContext(CartContext);