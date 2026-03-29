import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OwnerBottomNav from "../component/OwnerBottomNav";
import api from "../api/AxiosInstance"; // ✅ PAKAI INI

export default function PesananOwnerScreen({ navigation }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  

  // 🔥 AMBIL DATA PESANAN OWNER
  const fetchOrders = async () => {
    try {
      const res = await api.get("/owner/orders");
      setOrders(res.data);
    } catch (error) {
      console.log("Error fetch orders:", error);
    }
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (id, status) => {
  const validStatuses = ["ditolak", "dikonfirmasi"];
  if (!validStatuses.includes(status)) {
    Alert.alert("Error", "Status tidak valid");
    return;
  }

  try {
    // ✅ sesuaikan route backend
    const res = await api.put(`/orders/${id}/status`, { status });

    Alert.alert("Berhasil", res.data.message || "Status pesanan diperbarui");

    // 🔥 hapus dari list jika ditolak
    if (status === "ditolak") {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: status } : order
        )
      );
    }
  } catch (error) {
    console.log("Error update status:", error.response?.data || error.message);
    const msg =
      error.response?.data?.message ||
      "Terjadi kesalahan saat mengupdate status";
    Alert.alert("Error", msg);
  }
};
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Pelanggan</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔥 LOOP DATA */}
        {orders.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Belum ada pesanan
          </Text>
        ) : (
          orders.map((order) => (
            <View key={order.id}>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Detail Pesanan</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Nama Pelanggan</Text>
                  <Text style={styles.value}>{order.user?.nama || "-"}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Jenis BBM</Text>
                  <Text style={styles.value}>
                    {order.items.map((i) => i.jenis_bbm).join(", ")}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Jumlah</Text>
                  <Text style={styles.value}>
                    {order.items.map((i) => i.qty + " L").join(", ")}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Total</Text>
                  <Text style={styles.value}>Rp {order.total_harga}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Status</Text>
                  <Text style={styles.value}>{order.status}</Text>
                </View>
              </View>

              {/* BUTTON */}
              {order.status === "pending" && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => updateStatus(order.id, "ditolak")}
                  >
                    <Text style={styles.rejectText}>Tolak</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => updateStatus(order.id, "dikonfirmasi")}
                  >
                    <Text style={styles.confirmText}>Konfirmasi</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTTOM NAV COMPONENT */}
      <OwnerBottomNav navigation={navigation} active="Pesanan" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: { fontSize: 18, fontWeight: "bold" },

  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 120 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    elevation: 3,
  },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },

  row: { marginBottom: 12 },

  label: { fontSize: 14, color: "#888" },

  value: { fontSize: 15, fontWeight: "bold" },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  rejectButton: {
    flex: 1,
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  rejectText: { color: "#fff", fontWeight: "bold" },

  confirmText: { color: "#fff", fontWeight: "bold" },
});