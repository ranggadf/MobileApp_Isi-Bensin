import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OwnerBottomNav from "../component/OwnerBottomNav";

export default function RiwayatOwnerScreen({ navigation }) {

  const dataRiwayat = [
    {
      id: "1",
      nama: "Budi Santoso",
      bbm: "Pertalite",
      jumlah: "20 Liter",
      tanggal: "20 Feb 2026",
      status: "Selesai",
    },
    {
      id: "2",
      nama: "Andi Wijaya",
      bbm: "Pertamax",
      jumlah: "15 Liter",
      tanggal: "18 Feb 2026",
      status: "Ditolak",
    },
    {
      id: "3",
      nama: "Siti Aisyah",
      bbm: "Pertalite",
      jumlah: "10 Liter",
      tanggal: "17 Feb 2026",
      status: "Selesai",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.nama}>{item.nama}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Selesai"
              ? styles.statusSuccess
              : styles.statusReject,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.detail}>
        {item.bbm} • {item.jumlah}
      </Text>
      <Text style={styles.tanggal}>{item.tanggal}</Text>
    </View>
  );

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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTTOM NAV */}
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
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  },

  detail: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },

  tanggal: {
    marginTop: 5,
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
});