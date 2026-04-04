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
import api from "../api/AxiosInstance";
import { useNavigation } from "@react-navigation/native";

export default function PesananOwnerScreen() {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/owner/orders");
      // tampilkan hanya yang pending atau sedang diantar
      const filtered = res.data.filter((order) =>
        ["pending", "sedang diantar"].includes(order.status)
      );
      setOrders(filtered);
    } catch (error) {
      console.log("Error fetch orders:", error.response?.data || error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      Alert.alert("Berhasil", res.data.message || "Status pesanan diperbarui");

      // update state lokal
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.log("Error update status:", error.response?.data || error.message);
      Alert.alert("Error", "Gagal update status pesanan");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Pelanggan</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                    onPress={() => updateStatus(order.id, "sedang diantar")}
                  >
                    <Text style={styles.confirmText}>Konfirmasi</Text>
                  </TouchableOpacity>
                </View>
              )}

           {order.status === "sedang diantar" && (
  <View style={styles.buttonContainer}>
   <TouchableOpacity
  style={styles.routeButton}
  onPress={() => {
    console.log("ORDER DI KLIK:", order);

    navigation.navigate("DetailPengantaran", {
      orderId: order.id, // 🔥 INI YANG PALING PENTING
    });
  }}
>
  <Text style={styles.routeText}>Lihat Rute Pengantaran</Text>
</TouchableOpacity>

    <TouchableOpacity
      style={styles.completeButton}
      onPress={() => updateStatus(order.id, "selesai")}
    >
      <Text style={styles.completeText}>Selesai</Text>
    </TouchableOpacity>
  </View>
)}
            </View>
          ))
        )}
      </ScrollView>

      <OwnerBottomNav active="Pesanan" />
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
  routeButton: {
    flex: 1,
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  rejectText: { color: "#fff", fontWeight: "bold" },
  confirmText: { color: "#fff", fontWeight: "bold" },
  routeText: { color: "#fff", fontWeight: "bold" },
  completeText: { color: "#fff", fontWeight: "bold" },
});