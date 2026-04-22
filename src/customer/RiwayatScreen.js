import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomerBottomNav from "../component/CustomerBottomNav";
import api from "../api/AxiosInstance";

const { height } = Dimensions.get("window");

const CARD_HEIGHT = (height - 200) / 4;

export default function RiwayatScreen() {
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiwayat();
    const interval = setInterval(fetchRiwayat, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiwayat = async () => {
    try {
      const response = await api.get("/my-orders");

      const data = Array.isArray(response.data) ? response.data : [];

      const filtered = data.filter((order) => {
        const status = order.status?.toLowerCase();
        return (
          status === "selesai" ||
          status === "ditolak" ||
          status === "expired"
        );
      });

      setRiwayatData(filtered);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LABEL STATUS (INI FIX UTAMA)
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "expired":
        return "Kadaluarsa";
      case "ditolak":
        return "Ditolak";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  // 🔥 STYLE STATUS
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "ditolak":
        return { color: "#EF4444", bg: "#fee2e2" };
      case "expired":
        return { color: "#6B7280", bg: "#e5e7eb" };
      case "selesai":
        return { color: "#16A34A", bg: "#dcfce7" };
      default:
        return { color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const renderItem = ({ item }) => {
    const status = item.status;
    const label = getStatusLabel(status);
    const statusStyle = getStatusStyle(status);

    return (
      <View style={[styles.card, { height: CARD_HEIGHT }]}>
        {/* TOP */}
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item?.warung?.nama_warung || "Warung"}
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: statusStyle.color,
                backgroundColor: statusStyle.bg,
              },
            ]}
          >
            {label}
          </Text>
        </View>

        {/* ITEM */}
        {Array.isArray(item.items) && item.items.length > 0 && (
          <Text style={styles.itemText}>
            {item.items[0].jenis_bbm} • {item.items[0].qty}L
          </Text>
        )}

        {/* BOTTOM */}
        <View style={styles.bottomRow}>
          <Text style={styles.total}>Rp {item.total_harga}</Text>

          <Text style={styles.time}>
            {new Date(item.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (riwayatData.length === 0) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.empty}>Belum ada riwayat</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Pesanan</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={riwayatData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  header: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    color: "#1e293b",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    justifyContent: "center",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  name: {
    color: "#1e293b",
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },

  status: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },

  itemText: {
    fontSize: 13,
    color: "#475569",
  },

  total: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "bold",
  },

  time: {
    fontSize: 12,
    color: "#64748b",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    color: "#64748b",
  },
});