import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../api/AxiosInstance";
import CustomerBottomNav from "../component/CustomerBottomNav";

export default function PesananScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const alertedOrders = useRef(new Set());
  const prevOrders = useRef([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/my-orders");
      const allOrders = Array.isArray(res.data) ? res.data : [];

      // 🔥 ALERT EXPIRED BARU
      allOrders.forEach((order) => {
        const status = order.status?.toLowerCase();
        const prev = prevOrders.current.find((o) => o.id === order.id);

        const isNewExpired =
  status === "expired" &&
  prev &&
  prev.status?.toLowerCase() === "pending";

        if (isNewExpired && !alertedOrders.current.has(order.id)) {
          alertedOrders.current.add(order.id);

          Alert.alert(
            "Pesanan Kadaluarsa",
            "Pesanan tidak dikonfirmasi dalam 30 detik"
          );
        }
      });

      prevOrders.current = allOrders;

      // 🔥 FILTER
      const filtered = allOrders.filter((order) => {
        const status = order.status?.toLowerCase();
        return status !== "selesai" && status !== "ditolak" && status !== "expired";
      });

      setOrders(filtered);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ================= LABEL STATUS =================
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "expired":
        return "Kadaluarsa";
      case "sedang diantar":
        return "Sedang Diantar";
      case "selesai":
        return "Selesai";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
  };

  // ================= COLOR STATUS =================
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#F59E0B";
      case "expired":
        return "#6B7280";
      case "sedang diantar":
        return "#2563EB";
      case "selesai":
        return "#16A34A";
      case "ditolak":
        return "#EF4444";
      default:
        return "#111827";
    }
  };

  const renderItem = ({ item }) => {
    const label = getStatusLabel(item.status);
    const color = getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <Text style={styles.nama}>
          {item?.warung?.nama_warung || "Nama warung tidak ada"}
        </Text>

        {item.items?.map((itm, index) => (
          <Text key={index} style={styles.detail}>
            {itm.qty}L {itm.jenis_bbm} = Rp {itm.qty * itm.harga}
          </Text>
        ))}

        <Text style={styles.ongkir}>Ongkir: Rp {item.ongkir}</Text>

        <Text style={styles.total}>Total: Rp {item.total_harga}</Text>

        <Text style={[styles.status, { color }]}>
          Status: {label}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Pesanan Saya</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : orders.length === 0 ? (
          <Text style={styles.empty}>Belum ada pesanan</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
    color: "#1e293b",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#64748b",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },

  nama: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#0f172a",
  },

  detail: {
    color: "#475569",
    fontSize: 13,
  },

  ongkir: {
    marginTop: 6,
    color: "#475569",
    fontSize: 13,
  },

  total: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#16a34a",
    fontSize: 14,
  },

  status: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 13,
  },
});