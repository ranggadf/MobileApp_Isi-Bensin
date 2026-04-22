import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OwnerBottomNav from "../component/OwnerBottomNav";
import api from "../api/AxiosInstance";

export default function RiwayatOwnerScreen({ navigation }) {
  const [dataRiwayat, setDataRiwayat] = useState([]);

  // ================= FETCH RIWAYAT =================
  const fetchRiwayat = async () => {
    try {
      const res = await api.get("/owner/riwayat");
      setDataRiwayat(res.data);
    } catch (error) {
      console.log("Error fetch riwayat:", error.message);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // ================= RENDER ITEM =================
  const renderItem = ({ item }) => {
    const statusLabel =
      item.status === "expired"
        ? "kadaluarsa"
        : item.status === "ditolak"
        ? "DITOLAK"
        : item.status === "selesai"
        ? "SELESAI"
        : item.status;

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.rowBetween}>
          <Text style={styles.nama}>{item.user?.nama || "-"}</Text>

          <Text
            style={[
              styles.status,
              item.status === "selesai"
                ? styles.statusSuccess
                : item.status === "expired" || item.status === "ditolak"
                ? styles.statusReject
                : styles.statusPending,
            ]}
          >
            {statusLabel}
          </Text>
        </View>

        {/* DETAIL ITEM */}
        <Text style={styles.detail}>
          {(item.items || [])
            .map((i) => `${i.jenis_bbm} • ${i.qty} L`)
            .join(", ")}
        </Text>

        {/* TANGGAL */}
        <Text style={styles.tanggal}>
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={dataRiwayat}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchRiwayat}
        refreshing={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Belum ada riwayat transaksi
          </Text>
        }
      />

      <OwnerBottomNav navigation={navigation} active="Riwayat" />
    </SafeAreaView>
  );
}
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

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nama: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  detail: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },

  tanggal: {
    marginTop: 6,
    fontSize: 12,
    color: "#999",
  },

  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },

  statusSuccess: {
    backgroundColor: "#D4EFDF",
    color: "#27AE60",
  },

  statusReject: {
    backgroundColor: "#FADBD8",
    color: "#C0392B",
  },

  statusPending: {
    backgroundColor: "#FCF3CF",
    color: "#F1C40F",
  },
});