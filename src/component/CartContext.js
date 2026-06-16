import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/AxiosInstance";

// =========================
// 🔹 MEMBUAT CONTEXT CART
// =========================
const CartContext = createContext();

// =========================
// 🔹 PROVIDER
// =========================
export const CartProvider = ({
  children,
}) => {
  // 🔥 STATE CART
  const [cartItems, setCartItems] =
    useState([]);

  // =========================
  // 🔹 LOAD CART
  // =========================
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");

      setCartItems(
        res.data.items || []
      );
    } catch (err) {
      console.log(
        "LOAD CART ERROR:",
        err
      );
    }
  };

  // =========================
  // 🔹 ADD CART
  // =========================
  const addToCart = async (data) => {
    try {
      await api.post("/cart", data);

      await loadCart();
    } catch (err) {
      console.log(
        "ADD CART ERROR:",
        err
      );
    }
  };

  // =========================
  // 🔹 REMOVE CART
  // =========================
  const removeFromCart = async (
    id
  ) => {
    try {
      await api.delete(`/cart/${id}`);

      await loadCart();
    } catch (err) {
      console.log(
        "DELETE ERROR:",
        err
      );
    }
  };

  // =========================
  // 🔹 CLEAR CART
  // =========================
  const clearCart = async () => {
    try {
      await api.delete("/cart-clear");

      setCartItems([]);
    } catch (err) {
      console.log(
        "CLEAR ERROR:",
        err
      );
    }
  };

  // =========================
  // 🔥 TOTAL ITEM CART
  // =========================
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.qty || 1),
      0
    );
  }, [cartItems]);

  // =========================
  // 🔹 AUTO LOAD
  // =========================
  useEffect(() => {
    loadCart();
  }, []);

  // =========================
  // 🔹 PROVIDER
  // =========================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,

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
// 🔹 CUSTOM HOOK
// =========================
export const useCart = () =>
  useContext(CartContext);