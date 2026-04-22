import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import OwnerBottomNav from "../component/OwnerBottomNav";
import api from "../api/AxiosInstance";

export default function PesananOwnerScreen() {
  const [orders, setOrders] = useState([]);
  const [tick, setTick] = useState(0);
  const [expiredNotified, setExpiredNotified] = useState([]);

  const intervalRef = useRef(null);
  const navigation = useNavigation();

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await api.get("/owner/orders");

      // ❗ hanya tampilkan order aktif (hapus selesai dari list)
      const filtered = Array.isArray(res.data)
        ? res.data.filter((order) =>
            ["pending", "sedang diantar"].includes(
              order.status?.toLowerCase()
            )
          )
        : [];

      setOrders(filtered);
    } catch (error) {
      console.log("Fetch error:", error.message);
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });

      // jika "selesai", otomatis hilang karena fetch filter
      await fetchOrders();
    } catch (error) {
      console.log("Update error:", error.message);
    }
  };

  // ================= TIMER (COUNTDOWN REFRESH UI) =================
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ================= POLLING =================
  useEffect(() => {
    fetchOrders();

    intervalRef.current = setInterval(fetchOrders, 3000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // ================= REFRESH SAAT FOCUS =================
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // ================= RENDER ITEM =================
  const renderItem = (order) => {
    const status = order.status?.toLowerCase();

    // ================= TIMER HITUNG MUNDUR =================
    const now = Date.now();
    const expireTime = order.expired_at
      ? new Date(order.expired_at + "Z").getTime()
      : null;

    const secondsLeft =
      status === "pending" && expireTime
        ? Math.max(0, Math.floor((expireTime - now) / 1000))
        : 0;

    return (
      <View key={order.id} style={styles.card}>
        <Text style={styles.titleCard}>Detail Pesanan</Text>

        {/* ⏱ TIMER (TETAP ADA - TIDAK DIHAPUS) */}
        {status === "pending" && (
          <Text style={styles.timer}>
            {secondsLeft > 0
              ? `Auto batal dalam ${secondsLeft} detik`
              : "Memproses..."}
          </Text>
        )}

        <Text style={styles.text}>
          Nama: {order.user?.nama}
        </Text>

        <Text style={styles.text}>
          BBM: {(order.items || [])
            .map((i) => i.jenis_bbm)
            .join(", ")}
        </Text>

        <Text style={styles.text}>
          Total: Rp {order.total_harga}
        </Text>

        {/* STATUS */}
        <Text style={styles.status}>
          Status: {status}
        </Text>

        {/* ================= PENDING ================= */}
        {status === "pending" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => updateStatus(order.id, "expired")}
            >
              <Text style={styles.btnText}>Tolak</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() =>
                updateStatus(order.id, "sedang diantar")
              }
            >
              <Text style={styles.btnText}>Konfirmasi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= SEDANG DIANTAR ================= */}
        {status === "sedang diantar" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.routeBtn}
              onPress={() =>
                navigation.navigate("DetailPengantaran", {
                  orderId: order.id,
                  warung: order.warung,
                })
              }
            >
              <Text style={styles.btnText}>Lihat Rute</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => updateStatus(order.id, "selesai")}
            >
              <Text style={styles.btnText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Pelanggan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {orders.length === 0 ? (
          <Text style={styles.empty}>Belum ada pesanan aktif</Text>
        ) : (
          orders.map(renderItem)
        )}
      </ScrollView>

      <OwnerBottomNav active="Pesanan" orderCount={orders.length} />
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },

  titleCard: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },

  text: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 2,
  },

  timer: {
    color: "#DC2626",
    fontWeight: "700",
    marginBottom: 8,
  },

  status: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 13,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 14,
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: "#22C55E",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  routeBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },

  doneBtn: {
    flex: 1,
    backgroundColor: "#16A34A",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});