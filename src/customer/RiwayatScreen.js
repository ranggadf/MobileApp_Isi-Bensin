import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function RiwayatScreen() {
  const navigation = useNavigation();

  const riwayatData = [
    {
      id: "ORD-001",
      nama: "Warung A",
      gambar: "https://via.placeholder.com/70",
      bensin: "Pertalite",
      jumlah: "1 Liter",
      total: "Rp 14.000",
      status: "Selesai",
    },
    {
      id: "ORD-002",
      nama: "Warung B",
      gambar: "https://via.placeholder.com/70",
      bensin: "Pertamax",
      jumlah: "2 Liter",
      total: "Rp 32.000",
      status: "Selesai",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Pesanan</Text>
      </View>

      {/* CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {riwayatData.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            <View style={styles.itemRow}>
              <Image source={{ uri: item.gambar }} style={styles.image} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.nama}</Text>
                <Text style={styles.price}>{item.bensin} • {item.jumlah}</Text>
              </View>
            </View>

            <Text style={styles.total}>Total: {item.total}</Text>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("DashboardCustomer")}>
          <Ionicons name="home-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("KeranjangScreen")}>
          <Ionicons name="cart-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PesananScreen")}>
          <Ionicons name="chatbubble-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("RiwayatScreen")}>
          <Ionicons name="time-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1520",
    paddingHorizontal: 15,
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#2A2F3A",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    color: "#fff",
    fontWeight: "600",
  },
  status: {
    color: "#FF9800",
    fontWeight: "700",
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  name: {
    color: "#fff",
    fontWeight: "600",
  },
  price: {
    color: "#ddd",
  },
  total: {
    marginTop: 6,
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomNav: {
    height: 72,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1B202B",
    borderTopWidth: 1,
    borderTopColor: "#2A2F3A",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
